export default function ProviderTable({ providers, onApprove, onReject }) {
  return (
    <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {providers.map((p) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>{p.email}</td>
            <td>{p.category}</td>

            <td>
              <button onClick={() => onApprove(p._id)}>Approve</button>
              <button onClick={() => onReject(p._id)}>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}