import { useState } from 'react';
import { Reservation } from '../types/Reservation';
import { toast } from 'react-toastify';

const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${apiUrl}/reservations`);
      if (!response.ok) {
        toast.error('Ocurrio un error al buscar las reservas');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      toast.error('Ocurrio un error al buscar las reservas:');
    } finally {
    }
  };

  const createReservation = async (reservation: Reservation): Promise<Reservation | void> => {
    try {
      const response = await fetch(`${apiUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error al crear la reserva: ${errorData.message}`);
        return;
      }
      toast.success('Reserva creada con exito');
      return await response.json();
    } catch (error) {
      toast.error('Error al crear la reserva');
    } finally {
      fetchReservations();
    }
  };

  const updateReservation = async (reservation: Reservation): Promise<Reservation | void> => {
    try {
      const response = await fetch(`${apiUrl}/reservations/${reservation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error al actualizar la reserva: ${errorData.message}`);
        return;
      }
      toast.success('Reserva actualizada con exito');
      return await response.json();
    } catch (error) {
      toast.error('Error al actualizar la reserva');
    } finally {
      fetchReservations();
    }
  };

  const deleteReservation = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/reservations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error al eliminar la reserva: ${errorData.message}`);
        return;
      }
      toast.success('Reserva eliminada con éxito');
      return id;
    } catch (error) {
      toast.error('Error al eliminar la reserva');
    } finally {
      fetchReservations();
    }
  };

  return { fetchReservations, createReservation, updateReservation, deleteReservation, reservations };
};

export default useReservations;
