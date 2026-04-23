export const config = {
  rss_auto_discovery: true,
  storage: "memory",
  discord_webhook: process.env.DISCORD_WEBHOOK_URL || "",
  notificacoes_ativas: true
};
