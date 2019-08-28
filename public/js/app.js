$("#btn-scrape").click(() => {
  $.get("/api/scrape").then(() => location.reload());
});

$("#btn-delete").click(() => {
  $.ajax({
    url: "/api/comics",
    type: "DELETE"
  }).then(() => location.reload());
});

$("#notes").on("click", "#btn-delete-note", function() {
  let noteId = $(this).data("id");
  $.ajax({
    url: `/api/notes/${noteId}`,
    type: "DELETE"
  }).then(() => location.reload());
});

$("#notes").on("click", "#btn-add-note", function() {
  let comicId = $(this).data("id");
  $.ajax({
    url: `/api/comics/${comicId}`,
    type: "POST",
    data: {
      title: $("#input-title").val(),
      body: $("#input-body").val()
    }
  }).then((data) => {
    console.log(data);
    $("#notes").empty;
  });
  $("#input-title").val("");
  $("#input-body").val("");
});

$("#comics").on("click", ".comic-block", function() {
  $("#notes").empty();
  let comicId = $(this).data("id");
  $.get(`/api/comics/${comicId}`)
    .then((foundComic) => {
      $("#notes").append(`<h2>${foundComic.title}</h2>`);
      $("#notes").append("<input id='input-title' name='title'>");
      $("#notes").append("<textarea id='input-body' name='body'></textarea>");
      $("#notes").append(
        `<button id="btn-add-note" data-id="${foundComic._id}">Add Note</button>`
      );
      if (foundComic.note) {
        $("#input-title").val(foundComic.note.title);
        $("#input-body").val(foundComic.note.body);
        $("#notes").append(
          `<button id="btn-delete-note" data-id="${foundComic.note
            ._id}">Delete Note</button>`
        );
      }
    })
    .catch((err) => console.log(err));
});
