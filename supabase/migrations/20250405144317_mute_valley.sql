/*
  # Initial Schema Setup for Debate Application

  1. New Tables
    - users
      - Custom user profile data
      - Tracks points, win rate, and debate stats
    
    - debates
      - Stores active and past debates
      - Tracks participants and voting status
    
    - messages
      - Debate chat messages
      - Links to users and debates
    
    - votes
      - Tracks user votes in debates
      - Ensures one vote per voter per debate

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Protect voting integrity
*/

-- Users table extension (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  debates_participated INTEGER DEFAULT 0,
  debates_won INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Debates table
CREATE TABLE IF NOT EXISTS public.debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'voting', 'completed')),
  pro_points INTEGER DEFAULT 0,
  con_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Debate participants
CREATE TABLE IF NOT EXISTS public.debate_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('pro', 'con', 'voter')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(debate_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('pro', 'con', 'voter', 'system')),
  is_ai_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  vote_pro BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(debate_id, user_id)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Debates policies
CREATE POLICY "Anyone can read debates"
  ON public.debates
  FOR SELECT
  TO authenticated
  USING (true);

-- Participants policies
CREATE POLICY "Anyone can read participants"
  ON public.debate_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join debates"
  ON public.debate_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      SELECT COUNT(*) 
      FROM public.debate_participants 
      WHERE debate_id = NEW.debate_id AND role = NEW.role
    ) < CASE 
      WHEN NEW.role IN ('pro', 'con') THEN 3 
      WHEN NEW.role = 'voter' THEN 5 
    END
  );

-- Messages policies
CREATE POLICY "Anyone can read messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Participants can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 
      FROM public.debate_participants 
      WHERE debate_id = NEW.debate_id 
      AND user_id = auth.uid()
      AND role = NEW.role
    )
  );

-- Votes policies
CREATE POLICY "Anyone can read votes"
  ON public.votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Voters can cast votes"
  ON public.votes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 
      FROM public.debate_participants 
      WHERE debate_id = NEW.debate_id 
      AND user_id = auth.uid()
      AND role = 'voter'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_debate_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.debates
  SET 
    pro_points = CASE WHEN NEW.vote_pro THEN pro_points + 1 ELSE pro_points END,
    con_points = CASE WHEN NOT NEW.vote_pro THEN con_points + 1 ELSE con_points END,
    status = CASE 
      WHEN (pro_points + con_points) >= (
        SELECT COUNT(*) 
        FROM public.debate_participants 
        WHERE debate_id = NEW.debate_id 
        AND role = 'voter'
      ) THEN 'completed'
      ELSE status 
    END
  WHERE id = NEW.debate_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_cast
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_debate_points();

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update winner's stats
  UPDATE public.users
  SET 
    points = points + 200,
    debates_won = debates_won + 1,
    debates_participated = debates_participated + 1,
    updated_at = now()
  WHERE id IN (
    SELECT user_id 
    FROM public.debate_participants 
    WHERE debate_id = NEW.id 
    AND role = CASE 
      WHEN NEW.pro_points > NEW.con_points THEN 'pro'
      ELSE 'con'
    END
  );

  -- Update other participants' stats
  UPDATE public.users
  SET 
    points = points + 50,
    debates_participated = debates_participated + 1,
    updated_at = now()
  WHERE id IN (
    SELECT user_id 
    FROM public.debate_participants 
    WHERE debate_id = NEW.id 
    AND role NOT IN (
      CASE 
        WHEN NEW.pro_points > NEW.con_points THEN 'pro'
        ELSE 'con'
      END
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_debate_complete
  AFTER UPDATE OF status ON public.debates
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_user_stats();