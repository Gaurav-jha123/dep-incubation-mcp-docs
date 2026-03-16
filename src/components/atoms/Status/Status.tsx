type StatusProps = {
  status: "success" | "error";
};

export const Status = ({ status }: StatusProps) => {
  const color = status === "success" ? "green" : "red";

  return (
    <span style={{ color, fontWeight: "bold" }}>
      {status === "success" ? "Success" : "Error"}
    </span>
  );
};