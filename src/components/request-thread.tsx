import { Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function RequestThread({ requestId, asTeam }: { requestId: string; asTeam: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");
  const { data = [] } = useQuery({ queryKey: ["updates", requestId], queryFn: async () => (await supabase.from("request_updates").select("*").eq("request_id", requestId).order("created_at")).data ?? [] });
  const openFile = async (path: string) => { const { data } = await supabase.storage.from("request-files").createSignedUrl(path, 300); if (data) window.open(data.signedUrl, "_blank"); };
  const send = async (file?: File) => {
    if (!user || (!msg.trim() && !file)) return;
    let file_path: string | null = null;
    if (file) { file_path = `${requestId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`; const up = await supabase.storage.from("request-files").upload(file_path, file); if (up.error) return; }
    await supabase.from("request_updates").insert({ request_id: requestId, author_id: user.id, from_team: asTeam, message: msg || "File shared", file_path });
    setMsg(""); qc.invalidateQueries({ queryKey: ["updates", requestId] });
  };
  return <div className="thread">
    {data.map((u) => <div key={u.id} className={u.from_team ? "msg team" : "msg"}><b>{u.from_team ? "ZameenDhan team" : "You"}</b> {u.message}{u.file_path && <button type="button" onClick={() => openFile(u.file_path!)}>Open file</button>}</div>)}
    <div className="thread-input"><input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write a message"/><label className="file-btn">Attach<input type="file" hidden onChange={(e) => e.target.files?.[0] && send(e.target.files[0])}/></label><Button size="sm" onClick={() => send()}><Send size={14}/></Button></div>
  </div>;
}

