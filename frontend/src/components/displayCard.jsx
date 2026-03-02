import { Card, CardHeader, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import { Link } from 'react-router-dom';

export default function DisplayCard({
    type = "map", // "map", "achievement", or "game"
    title, subtitle, image, id, footerAction, 
    isOwner = false
}) {
    const theme = {
        map: { color: "primary", label: "Layout" },
        achievement: { color: "warning", label: "Achievement" },
        game: { color: "secondary", label: "Game Engine" }
    }[type];

    return (
        <Card className="max-w-[300px] border border-slate-200 hover:border-blue-400 transition-all shadow-sm">
            <CardHeader className="flex justify-between items-start px-4 pt-4">
                <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {theme.label}
                    </p>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{title}</h4>
                </div>
                <Chip size="sm" variant="flat" color={theme.color} className="capitalize">
                    {subtitle}
                </Chip>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image alt={title} className="object-cover rounded-xl w-full h-[140px] bg-slate-100"
                    src={image || "https://via.placeholder.com/300x150?text=No+Preview"} />
            </CardBody>
            <CardFooter className="gap-2">
                {type === "map" ? (
                    <>
                        <Button as={Link} to={`/designer?id=${id}`} size="sm" color="primary" className="flex-1 font-bold">
                            {isOwner ? "Edit" : "View Intel"}
                        </Button>
                        {isOwner && (
                            <Button size="sm" variant="flat" color="danger" onPress={() => footerAction(id)}>
                                Delete
                            </Button>
                        )}
                    </>
                ) : (
                    <Button fullWidth size="sm" variant="ghost" color={theme.color} className="font-bold">
                        {type === "game" ? "Launch Editor" : "View Details"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}