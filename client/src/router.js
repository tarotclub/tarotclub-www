import Vue from 'vue'
import VueRouter from 'vue-router';

//============================  COMPONENTS ============================
import Profile from './components/Profile';
import Machines from './components/Machines';
import MachineInfos from './components/MachineInfos';
import Users from './components/Users';

//============================  VIEWS ============================
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import ResetPassword from './views/ResetPassword';
import Signin from './views/Signin';
import Signup from './views/Signup';
import NewPassword from './views/NewPassword';


Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
      {
        path: '/',
        name: 'root',
        component: Home
      },
      {
        path: '/dashboard/Dashboard',
        name: 'Dashboard',
        component: Dashboard, 
      },
      {
        path: '/dashboard/profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: '/dashboard/machines',
        name: 'Machines',
        component: Machines
      },
      {
        path: '/dashboard/machineinfos/:id',
        name: 'MachineInfos',
        component: MachineInfos
      },
      {
        path: '/dashboard/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/sign-up',
        name: 'Signup',
        component: Signup
      },
      {
        path: '/resetpass',
        name: 'ResetPassord',
        component: ResetPassword
      },
      {
        path: '/newpassword/:token',
        name: 'NewPassword',
        component: NewPassword
      },
      { 
        path: "*", redirect: '/'
       }
      
    ]
  })
  
  router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    try {
      if (to.meta.minAccessLevel !== undefined) {
        if (to.meta.minAccessLevel > 0) {
          // if (!store2.state.checkAccess(to.meta.minAccessLevel)) {
          //   store2.state.commit('/');
          //   next({ path: '/' , query: null});
          // } else {
          //   next(); 
          // }
        } else {
          next();
        }
      } else {
        next();
      }
  
    } catch(e) {
      console.error("Error" + e);
    }
  })

  export default router

