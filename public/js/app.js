$("#btn-scrape").click(() => {
  $.get("/api/scrape").then(() => location.reload());
});

$("#btn-delete").click(() => {
  $.ajax({
    url: "/api/comics",
    type: "DELETE"
  }).then(() => location.reload());
});
