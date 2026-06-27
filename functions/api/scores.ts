interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { id, gameId, username, score, playDurationSeconds, playedAt } = body;

    if (!id || !gameId || !username || score === undefined || !playDurationSeconds || !playedAt) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const safeUsername = String(username).slice(0, 15).replace(/[<>"'&]/g, '');
    const safeScore = Math.max(0, Math.min(999999, Number(score)));
    const safeDuration = Math.max(0, Math.min(86400, Number(playDurationSeconds)));

    await env.DB.prepare(
      `INSERT OR IGNORE INTO game_scores
         (id, game_id, username, score, play_duration_seconds, played_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(String(id), String(gameId), safeUsername, safeScore, safeDuration, String(playedAt))
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
