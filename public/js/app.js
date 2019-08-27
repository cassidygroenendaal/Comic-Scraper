$("#btn-scrape").click(() => {
  $.get("/api/scrape").then(() => location.reload());
});
