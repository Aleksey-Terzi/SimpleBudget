import IconButton from "../IconButton";

interface Props {
    editUrl: string;
    deleteUrl?: string;
}

export default function EditCol({ editUrl, deleteUrl }: Props) {
    if (!deleteUrl) {
        return (
            <td className="text-nowrap w-6">
                <IconButton url={editUrl} icon="pencil" title="Edit" />
            </td>
        );
    }

    return (
        <td className="text-nowrap w-10 gap-1">
            <div className="flex g-1">
                <IconButton url={editUrl} icon="pencil" title="Edit" />
                <IconButton url={deleteUrl} icon="x-mark" title="Delete" />
            </div>
        </td>
    );
}