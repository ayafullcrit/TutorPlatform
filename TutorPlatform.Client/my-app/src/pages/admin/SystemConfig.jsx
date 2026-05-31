import { useEffect, useState } from "react";
import { getSystemConfig, updateSystemConfig } from "../../services/systemConfigService";

export default function SystemConfig() {
  const [rate, setRate] = useState(0.1);
  useEffect(() => { getSystemConfig().then(r => r.success && setRate(r.data.platformFeeRate)); }, []);
  return <div className="space-y-4">
    <h2 className="text-4xl font-serif">System Config</h2>
    <input type="number" step="0.01" value={rate} onChange={e=>setRate(parseFloat(e.target.value))} className="border p-2" />
    <button onClick={async()=>await updateSystemConfig({ platformFeeRate: rate })}>Save</button>
  </div>;
}
