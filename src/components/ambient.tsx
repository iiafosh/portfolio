// The sheet of working paper behind every page: tiled grain at the edge of
// perception and dashed drafting guides at the column edges (cali.so).
// Missable by design — noticed on the second visit, not the first.

export function Ambient() {
  return (
    <>
      <div className="paper-grain" aria-hidden="true" />
      <div className="column-guides" aria-hidden="true">
        <span className="column-guide-v" />
        <span className="column-guide-v" />
      </div>
    </>
  )
}
