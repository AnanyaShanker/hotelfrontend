

export default function Table({ headers, data }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-black to-gray-900 text-white">
          <tr>
            {headers.map((head, i) => (
              <th key={i} className="px-6 py-4 text-left text-sm uppercase">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100 transition">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
