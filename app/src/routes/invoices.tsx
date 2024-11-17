import React, { Fragment, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-modal';
import { fetchInvoiceById, fetchInvoices, setSelectedInvoice } from '../store/invoiceSlice.ts';
import {RootState} from '../store';
import {useQuery} from "@tanstack/react-query"
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
function formatMoney(number: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(number);
}
function formatDate(dateString:string|null) {
  if (dateString == null || dateString === '') {
    return "";
  }
  const date = new Date(dateString);
  // Then specify how you want your dates to be formatted
  return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date); // | date:"MMMM d, yyyy"-->
}

export default function Invoices() {
  let [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch();
  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  function displayInvoiceInfo(invoice){
    // I originally just passed the entire invoice to set the selectedInvoice without calling the API
    dispatch(fetchInvoiceById(invoice.id));
    openModal();
  }
  useEffect(()=> {
     dispatch(fetchInvoices())
   }, [])

  /*const {invoices, isLoading } = useQuery({
    queryFn: ()=> fetchInvoices(),
    queryKey:["invoices"]
  })*/

  const invoicesState = useSelector((state: RootState) => state.invoices);
  const userState =  useSelector((state: RootState) => state.users);
  if (userState.user == null) {
    return (
      <>
      <div>You are not logged in!</div>
      </>
    )
  }
  return (
    <>
      <div>
        <h2>Invoice List</h2>
        <table className="table ">
          <tr>
            <th>ID</th>
            <th>Vendor Name</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
          <tbody>
          {invoicesState.invoices && invoicesState.invoices.map((invoice) => (
            <tr key={invoice.id} onClick={()=> {displayInvoiceInfo(invoice)}}>
              <td>{invoice.id}</td>
              <td>{invoice.vendor_name}</td>
              <td>{formatMoney(invoice.amount)}</td>
              <td>{formatDate(invoice.due_date)}</td>
              <td>{invoice.paid ? "Paid" : "Open"}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
          <table className="table ">
            <tbody>
            {invoicesState.selectedInvoice !== null && (
              <Fragment>
                <tr>
                  <td>ID</td>
                  <td>{invoicesState.selectedInvoice.id}</td>
                </tr>
                <tr>
                  <td>Vendor Name</td>
                  <td>{invoicesState.selectedInvoice.vendor_name}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>{formatMoney(invoicesState.selectedInvoice.amount)}</td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>{formatDate(invoicesState.selectedInvoice.due_date)}</td>
                </tr>
                <tr>
                  <td>User ID</td>
                  <td>{invoicesState.selectedInvoice.user_id}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{invoicesState.selectedInvoice.description}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{invoicesState.selectedInvoice.paid ? 'Paid' : 'Open'}</td>
                </tr>
                <button onClick={closeModal}>Close</button>
              </Fragment>
            )}
            </tbody>
          </table>
        </Modal>
      </div>
    </>
  );
}
