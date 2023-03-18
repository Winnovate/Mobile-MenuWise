import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

const appInfoSlice = (set, get) => ({
  user: {
    name: '',
    isAuthenticated: false,
  },
  initial: false,
  manageUser: payload =>
    set(prev => ({
      ...prev,
      user: {...payload},
    })),
  setIsInitial: payload => set(prev => ({...prev, initial: payload})),
});

const petInfoSlice = (set, get) => ({
  name: '',
  age: '',
  updatePetInfo: payload =>
    set(prev => ({
      ...payload,
    })),
});

const appointmentSlice = (set, get) => ({
  appointments: [],
  updateAppointments: payload =>
    set(prev => ({
      appointments: [...payload],
    })),
});

const vaccineDataSlice = (set, get) => ({
  vaccineData: [
    {
      id: 1,
      name: 'Distemper',
      isChecked: false,
    },
    {
      id: 2,
      name: 'DHPP',
      isChecked: false,
    },
    {
      id: 3,
      name: 'Bordetella',
      isChecked: false,
    },
    {
      id: 4,
      name: 'Influenza',
      isChecked: false,
    },
    {
      id: 5,
      name: 'Leptospirosis',
      isChecked: false,
    },
  ],
  updateVaccine: payload =>
    set(prev => ({
      vaccineData: [...payload],
    })),
});

const restaurantDataSlice = (set, get) => ({
  restaurantData: null,
  restaurantId: undefined,
  catSelectedId: undefined,
  setRestaurantData: payload =>
    set(prev => ({
      restaurantData: payload,
    })),
  setRestaurantId: payload =>
    set(prev => ({
      restaurantId: payload,
    })),
  setcatSelectedId: payload =>
    set(prev => ({
      catSelectedId: payload,
    })),
});

const orderSlice = (set, get) => ({
  orders: [],
  setOrders: payload => {
    if (payload.action === 'add') {
      return set(prev => ({
        orders: [...prev?.orders, payload.data],
      }));
    } else if (payload.action === 'delete') {
      const updatedOrder = get().orders.filter(
        order => order.id !== payload.data.id,
      );
      return set(prev => ({
        orders: [...updatedOrder],
      }));
    }
  },
});

export const useStore = create(
  devtools((set, get) => ({
    ...appInfoSlice(set, get),
    ...petInfoSlice(set, get),
    ...appointmentSlice(set, get),
    ...vaccineDataSlice(set, get),
    ...restaurantDataSlice(set, get),
    ...orderSlice(set, get),
  })),
);
