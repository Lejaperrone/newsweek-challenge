import { Actions } from '../enums/ActionsEnum';
import { Reservation } from '../types/Reservation';

interface ReservationItemProps {
  reservation: Reservation;
  onAction: (action: Actions, reservation: Reservation) => void;
}

export default function ReservationItem({ reservation, onAction }: ReservationItemProps) {
  return (
    <tr className="bg-gray-800 hover:bg-gray-700 text-center align-middle">
      <td className="px-6 py-4">{reservation.code}</td>
      <td className="px-6 py-4">{reservation.fullName}</td>
      <td className="px-6 py-4">{reservation.email}</td>
      <td className="px-6 py-4">{reservation.status}</td>
      <td className="px-6 py-4 flex justify-center">
        <button
          onClick={() => onAction(Actions.SHOWFORM, reservation)}
          className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-4 py-2 mx-1"
        >
          Editar
        </button>
        <button
          onClick={() => onAction(Actions.DELETE, reservation)}
          className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm px-4 py-2 mx-1"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
