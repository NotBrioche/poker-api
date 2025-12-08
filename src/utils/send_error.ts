export default function (code: Number, message: String) {
  let error = "Handle it with status code";

  switch (code) {
    case 400:
      error = "Bad Request";
    case 401:
      error = "Unauthorized";
    case 403:
      error = "Forbidden";
  }

  return { error: error, message: message };
}
