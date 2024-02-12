import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Reservation } from '../types/Reservation';
import { Actions } from '../enums/ActionsEnum';
import { ReservationStatus } from '../enums/ReservationStatusEnum';
import { PaymentType } from '../enums/PaymentTypeEnum';
import * as Yup from 'yup';

interface ReservationFormProps {
  onClose: () => void;
  onSubmit: (action: Actions, reservation: Reservation) => void;
  reservationToEdit?: Reservation;
}

interface FieldFormProps {
  label: string;
  id: keyof Reservation;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

interface SelectFormProps {
  label: string;
  id: keyof Reservation;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, string>;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onClose, onSubmit, reservationToEdit }) => {
  const formik = useFormik({
    initialValues: reservationToEdit || {
      code: 0,
      fullName: '',
      email: '',
      numberOfGuests: 1,
      status: ReservationStatus.PAID,
      date: new Date().toISOString().substring(0, 10),
      amount: 220,
      discount: 0,
      totalAmount: 0,
      paymentType: PaymentType.CASH,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('El nombre completo es obligatorio.'),
      email: Yup.string()
        .email('El correo electrónico no es válido.')
        .required('El correo electrónico es obligatorio.'),
      code: Yup.number().positive('El codigo debe ser un número positivo'),
      numberOfGuests: Yup.number()
        .min(1, 'Debe haber al menos un huésped.')
        .max(12, 'El número de huéspedes no puede ser mayor a 12.')
        .required('El número de huéspedes es obligatorio.'),
      totalAmount: Yup.number().moreThan(-1, 'El monto total debe ser mayor o igual a 0'),
    }),
    onSubmit: values => {
      const action = reservationToEdit ? Actions.EDIT : Actions.CREATE;
      onSubmit(action, values);
      onClose();
    },
  });

  useEffect(() => {
    const total = formik.values.numberOfGuests * formik.values.amount - formik.values.discount;
    formik.setFieldValue('totalAmount', total);
  }, [formik.values.numberOfGuests, formik.values.amount, formik.values.discount, formik.setFieldValue]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <form onSubmit={formik.handleSubmit} className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {reservationToEdit ? 'Editar Reserva' : 'Nueva Reserva'}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FieldForm
            label="Nombre Completo"
            id="fullName"
            type="text"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : ''}
          />
          <FieldForm
            label="Email"
            id="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
          />
          <FieldForm
            label="Código"
            id="code"
            type="number"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && formik.errors.code ? formik.errors.code : ''}
          />
          <FieldForm
            label="Número de Huéspedes"
            id="numberOfGuests"
            type="number"
            value={formik.values.numberOfGuests}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.numberOfGuests && formik.errors.numberOfGuests ? formik.errors.numberOfGuests : ''}
          />
          <FieldForm
            label="Fecha"
            id="date"
            type="date"
            value={new Date(formik.values.date).toISOString().substring(0, 10)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && formik.errors.date ? formik.errors.date : ''}
          />
          <SelectForm
            label="Estado"
            id="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            options={ReservationStatus}
          />
          <FieldForm
            label="Descuento"
            id="discount"
            type="number"
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && formik.errors.discount ? formik.errors.discount : ''}
          />
          <SelectForm
            label="Tipo de Pago"
            id="paymentType"
            value={formik.values.paymentType}
            onChange={formik.handleChange}
            options={PaymentType}
          />
          <FieldForm
            label="Monto"
            id="amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && formik.errors.amount ? formik.errors.amount : ''}
            disabled
          />
          <FieldForm
            label="Monto Total"
            id="totalAmount"
            type="text"
            value={formik.values.totalAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.totalAmount && formik.errors.totalAmount ? formik.errors.totalAmount : ''}
            disabled
          />
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm px-4 py-2 mx-1 w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
              className={`text-white rounded-lg text-sm px-4 py-2 mx-1 w-full sm:w-auto ${
                !formik.dirty || !formik.isValid
                  ? 'bg-blue-400 hover:bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {reservationToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const FieldForm: React.FC<FieldFormProps> = ({ label, id, type, value, disabled, onChange, onBlur, error }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
      disabled={disabled}
    />
    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
  </div>
);

const SelectForm: React.FC<SelectFormProps> = ({ label, id, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  </div>
);

export default ReservationForm;
