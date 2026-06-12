export default function Flags({ cc, size = 22 }) {
  if (!cc || cc.length === 0) return null;
  return (
    <span className="flags" aria-hidden="true">
      {cc.map((c, i) => (
        <img
          key={i}
          className="flag"
          src={`https://flagcdn.com/w40/${c}.png`}
          srcSet={`https://flagcdn.com/w80/${c}.png 2x`}
          width={size}
          height={size}
          alt=""
          loading="lazy"
        />
      ))}
    </span>
  );
}
