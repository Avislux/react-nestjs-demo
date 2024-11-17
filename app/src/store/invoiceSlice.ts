import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { invoiceSchema, invoicesSchema } from '../schemas/invoiceSchema.ts';
import axios from 'axios';
import localforage from 'localforage';
interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  customerName: string;
}

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  selectedInvoice: Invoice| null;
}

const initialState: InvoiceState = {
  invoices: [],
  isLoading: false,
  error: null,
  selectedInvoice: null
};

let host = import.meta.env.VITE_API_HOST ?? "http://localhost:3000";

export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices'
  ,  async (_,{rejectWithValue}) => {
    const link: string = host + "/invoices";
    const token = await localforage.getItem('token') ?? '';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    };
    try {
      const response =  await axios.get(link, config);
      invoicesSchema.parse(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Error');
    }
});
export const fetchInvoiceById = createAsyncThunk('invoices/fetchInvoiceById'
  ,  async (id,{rejectWithValue}) => {
    const link: string = host + "/invoices/" + id.toString();
    const token = await localforage.getItem('token') ?? '';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    };
    try {
      const response =  await axios.get(link, config);
      invoiceSchema.parse(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Error');
    }
  });

export const setSelectedInvoice = createAsyncThunk('invoices/setSelectedInvoice'
  ,  async (invoice: Invoice) => {
    return invoice;


  });
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setSelectedInvoice.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
      });
  },
});
/**/
export default invoiceSlice.reducer;