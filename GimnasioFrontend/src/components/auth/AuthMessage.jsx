export default function AuthMessage({ type = "error", message }) {
  if (!message) return null;

  return (
    <div className={type === "success" ? "success-message" : "error-message"}>
      {message}
    </div>
  );
}
