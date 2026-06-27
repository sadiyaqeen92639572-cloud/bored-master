interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const gameId = String(params.gameId);

    const { results } = await env.DB.prepare(
      `SELECT username, score, play_duration_seconds, played_at
       FROM game_scores
       WHERE game_id = ?
       ORDER BY score DESC
       LIMIT 10`
    )
      .bind(gameId)
      .all();

    return new Response(JSON.stringify(results ?? []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
