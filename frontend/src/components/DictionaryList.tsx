interface DictionaryListProps {
  dictionaries: any[]
}

export function DictionaryList({ dictionaries }: DictionaryListProps) {
  if (dictionaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">登録された辞書がありません</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              辞書名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              登録日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              項目数
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dictionaries.map((dict) => (
            <tr key={dict.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dict.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dict.uploadDate.toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dict.itemCount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-primary-600 hover:text-primary-900 mr-4">編集</button>
                <button className="text-danger-600 hover:text-danger-900">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
