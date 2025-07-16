import Button from "@/components/ui/ButtonCustom";
import { LeaveRoomAction } from "../type";

interface props {
    leaveRoomAction: (status: LeaveRoomAction) => void;
    cancelAction: () => void;
}
const LeaveOrKeepRoom = ({ cancelAction, leaveRoomAction }: props) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-center font-semibold line-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo,
                sit dignissimos autem error, sunt nobis iste recusandae possimus
                assumenda pariatur doloremque quibusdam, omnis blanditiis aut
                repellat expedita iusto laudantium magnam!
            </span>
            <Button
                onClick={() => leaveRoomAction(LeaveRoomAction.DESTROY)}
                text="Leave"
                variant="custom"
                fullWidth={true}
            >
                Leave
            </Button>
            <Button
                onClick={() => leaveRoomAction(LeaveRoomAction.KEEP)}
                text="Keep"
                variant="primary"
                fullWidth={true}
            >
                Keep
            </Button>
            <Button
                onClick={cancelAction}
                text="Cancel"
                variant="secondary"
                fullWidth={true}
            >
                cancel
            </Button>
        </div>
    );
};

export default LeaveOrKeepRoom;
