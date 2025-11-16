import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { Configuration, OpenAIApi } from 'npm:openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Check message content
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a debate moderator AI. Analyze the following message for:
            1. Hate speech or discriminatory content
            2. Personal attacks or ad hominem arguments
            3. Off-topic or irrelevant content
            4. Excessive emotional language
            
            Respond with a JSON object containing:
            {
              "isAppropriate": boolean,
              "reason": string (if inappropriate),
              "suggestedRevision": string (if inappropriate)
            }`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const analysis = JSON.parse(completion.data.choices[0].message?.content || '{}');

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (!analysis.isAppropriate) {
      // Flag the message in the database
      const { error } = await supabaseClient
        .from('messages')
        .update({ is_ai_flagged: true })
        .eq('id', message.id);

      if (error) throw error;
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});