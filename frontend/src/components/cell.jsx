import { ASSET_BASE_URL } from '../api';

export default function Cell({ type }) {
    //accepts cell grid position, selected state, and asset list
    if (!type || type === "empty" || type === "select") {
        return <span className="text-[8px] opacity-10">{type}</span>
    }

    return (
        <div className="relative w-full h-full">
            <img
                src={`${ASSET_BASE_URL}/${type}`}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
        </div>
    );
}