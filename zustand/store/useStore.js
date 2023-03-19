import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

const appInfoSlice = (set, get) => ({
  user: {
    name: '',
    isAuthenticated: false,
  },
  app: {
    lang: 'fr',
  },
  initial: false,
  manageUser: payload =>
    set(prev => ({
      ...prev,
      user: {...payload},
    })),
  setIsInitial: payload => set(prev => ({...prev, initial: payload})),
  setLang: payload => set(prev => ({...prev, app: {lang: payload}})),
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
    ...restaurantDataSlice(set, get),
    ...orderSlice(set, get),
  })),
);
