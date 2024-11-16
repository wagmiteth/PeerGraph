import { useState, useEffect } from 'react';
import { QueryParameter, DuneClient } from "@duneanalytics/client-sdk";

function DuneQueryComponent() {
    const [queryResults, setQueryResults] = useState<any>(null);

    useEffect(() => {
        // Define async function inside useEffect
        async function fetchData() {
            const dune = new DuneClient(process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "NH79oReukMRCELkXcPsKzTsofjmsfrNp");
            const results = await dune.getLatestResult({ queryId: 4290058 });
            setQueryResults(results);
        }

        // Call the async function
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    return (
        // <div>
        //     {queryResults && JSON.stringify(queryResults, null, 2)}
        // </div>
        <div className="overflow-x-auto">
            {queryResults && queryResults.result?.rows && (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            {Object.keys(queryResults.result.rows[0] || {}).map((header) => (
                                <th key={header} className="border p-2 bg-gray-100">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {queryResults.result.rows.map((row: any, i: number) => (
                            <tr key={i}>
                                {Object.values(row).map((value: any, j: number) => (
                                    <td key={j} className="border p-2">
                                        {value?.toString() || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DuneQueryComponent;
