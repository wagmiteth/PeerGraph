import { useState, useEffect } from 'react';
import { QueryParameter, DuneClient } from "@duneanalytics/client-sdk";

function DuneQueryComponent({ fid }: { fid: number }) {
    const [queryResults, setQueryResults] = useState<any>(null);

    useEffect(() => {
        // Define async function inside useEffect
        async function fetchData() {
            const dune = new DuneClient(process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "NH79oReukMRCELkXcPsKzTsofjmsfrNp");
            const parameter: QueryParameter = {
                key: 'fid',
                type: 'Number',
                value: fid
            };
            /* SQL Query:
            -- List all followers of followers of an account
            WITH t_follower AS (
                SELECT ln.target_fid AS follower
                FROM dune.neynar.dataset_farcaster_links ln
                WHERE
                    ln.fid = {{s_fid}}
                    AND ln.type = 'follow'
            )
            SELECT target_fid
            FROM dune.neynar.dataset_farcaster_links ln
            WHERE ln.fid IN (SELECT follower FROM t_follower);
            */
            const results = await dune.getLatestResult({ queryId: 4290058, parameters: [parameter] });
            setQueryResults(results);
        }

        // Call the async function
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    return (
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
