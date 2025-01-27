import { createRouter, createWebHistory } from 'vue-router'; 
import HelloWorld from '@/components/HelloWorld.vue';
import EditLog from '@/components/EditLog.vue';
import AddLog from '@/components/AddLog.vue';
import UrlsWs from '@/components/UrlsWs.vue';
import LoginSimp from '@/components/LoginSimp.vue';
import RegistreWs from '@/components/RegistreWs.vue';
import EndPoint from '@/components/EndPoint.vue';
import AddEnd from '@/components/AddEnd.vue';
import EditEnd from '@/components/EditEnd.vue';
import HeaderWs from '@/components/HeaderWs.vue';
import HeaderUrl from '@/components/HeaderUrl.vue';
import AddHedUrl from '@/components/AddHedUrl.vue';
import EditHedUrl from '@/components/EditHedUrl.vue';
import EditHeader from '@/components/EditHeader.vue';
import ProcApi from '@/components/ProcApi.vue';
import FonctionWs from '@/components/FonctionWs.vue';
import EditFonc from '@/components/EditFonc.vue';
import AddHeader from '@/components/AddHeader.vue';
import MappingWs from '@/components/MappingWs.vue';
import AddProc from '@/components/AddProc.vue';
import EditProc from '@/components/EditProc.vue';
import AddFonction from '@/components/AddFonction.vue';
import EditMap from '@/components/EditMap.vue';
import AddMap from '@/components/AddMap.vue';
import SettingSimp from '@/components/SettingSimp.vue';
import BpmnTest from '@/components/BpmnTest.vue';
import FilsUpload from '@/components/FilsUpload.vue';
import FilsUploadd from '@/components/FilsUploadd.vue';
import MxFile from '@/components/MxFile.vue';
import MtFile from '@/components/MtFile.vue';
import ProxiesWs from '@/components/ProxiesWs.vue';
import AddProxie from '@/components/AddProxie.vue';
import EditProxie from '@/components/EditProxie.vue';
import ProcUrl from '@/components/ProcUrl.vue';
import AddProcUrl from '@/components/AddProcUrl.vue';
import EditProcUrl from '@/components/EditProcUrl.vue';
import UsersWS from '@/components/UsersWS.vue';
import LifeCycle from '@/components/LifeCycle.vue';
import EditUser from '@/components/EditUser.vue';









const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'LoginSimp',
        component: LoginSimp,
        meta: {
          hideNavbar: true,
        }
      },
      
      {
        path: '/UsersWS/',
        name: 'UsersWS',
        component: UsersWS,
        meta: { requiresAuth: true },

      },


      {
        path: '/registre/',
        name: 'RegistreWs',
        component: RegistreWs,
        meta: {
          hideNavbar: true,
         }
      },
      {
        path: '/user/EditUser/:Id',
        name: 'EditUser',
        component: EditUser,
        meta: {
          hideNavbar: true,
         }
      },
      {
        path: '/SettingSimp/:Id',
        name: 'SettingSimp',
        component: SettingSimp,
        meta: {
          // hideNavbar: true,
         }
      },
     

      {
        path: '/AddEnd/',
        name: 'AddEnd',
        component: AddEnd,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      
      {
        path: '/user/editEnd/:Id',
        name: 'EditEnd',
        component: EditEnd,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      
      {
        path: '/user/EditHeader/:Id',
        name: 'EditHeader',
        component: EditHeader,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/user/EditHedUrl/:Id',
        name: 'EditHedUrl',
        component: EditHedUrl,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/AddMap/',
        name: 'AddMap',
        component: AddMap,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },

      {
        path: '/AddPrc/',
        name: 'AddProc',
        component: AddProc,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
          path: '/Bpmn/',
          name: 'Bpmn',
          component: BpmnTest,
          meta: { requiresAuth: true },
  
        },
       
        {
          path: '/MxFile/',
          name: 'MxFile',
          component: MxFile,
          meta: { requiresAuth: true },
  
        },

        {
          path: '/MtFile/',
          name: 'MtFile',
          component:  MtFile,
          meta: { requiresAuth: true },
  
        },


        
        {
          path: '/fils/',
          name: 'FilsUpload',
          component: FilsUpload,
          meta: { requiresAuth: true },
  
        },
        {
          path: '/fills/',
          name: 'FilsUploadd',
          component: FilsUploadd,
          meta: { requiresAuth: true },
  
        },

        {
          path: '/LifeCycle/',
          name: 'LifeCycle',
          component: LifeCycle,
          meta: { requiresAuth: true },
  
        },

      {
        path: '/AddFonc/',
        name: 'AddFonction',
        component: AddFonction,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },

      {
        path: '/user/editProc/:Id',
        name: 'EditProc',
        component: EditProc,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },

      {
        path: '/user/editFonc/:Id',
        name: 'EditFonc',
        component: EditFonc,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },

      {
        path: '/user/editMap/:Id',
        name: 'EditMap',
        component: EditMap,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/end/',
        name: 'EndPoint',
        component: EndPoint,
        meta: { requiresAuth: true,
         },

      },

      {
        path: '/mapping/',
        name: 'MappingWs',
        component: MappingWs,
        meta: { requiresAuth: true },

      },
      {
        path: '/proxies/',
        name: 'ProxiesWs',
        component: ProxiesWs,
        meta: { requiresAuth: true
        },
      },
      {
        path: '/AddProxie/',
        name: 'AddProxie',
        component: AddProxie,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/user/EditProxie/:Id',
        name: 'EditProxie',
        component: EditProxie,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      
      {
        path: '/ProcUrl/',
        name: 'ProcUrl',
        component: ProcUrl,
        meta: { requiresAuth: true },
      },
      {
        path: '/AddProcUrl/',
        name: 'AddProcUrl',
        component: AddProcUrl,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      
      {
        path: '/user/EditProcUrl/:Id',
        name: 'EditProcUrl',
        component: EditProcUrl,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/header/',
        name: 'HeaderWs',
        component: HeaderWs,
        meta: { requiresAuth: true },
      },
      {
        path: '/headerUrl/',
        name: 'HeaderUrl',
        component: HeaderUrl,
        meta: { requiresAuth: true },
      },
      {
        path: '/AddHedUrl/',
        name: 'AddHedUrl',
        component: AddHedUrl,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },


      
      {
        path: '/Addheader/',
        name: 'AddHeader',
        component: AddHeader,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },


      {
        path: '/ProcApi/',
        name: 'ProcApi',
        component: ProcApi,
        meta: { requiresAuth: true },
      },

      {
        path: '/fonction/',
        name: 'FonctionWs',
        component: FonctionWs,
        meta: { requiresAuth: false },

      },


      {
        path: '/user/',
        name: 'HelloWorld',
        component: HelloWorld,
        meta: { requiresAuth: true },
      },

      {
        path: '/user/edit/:Id',
        name: 'EditLog',
        component: EditLog,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/user/add',
        name: 'AddLog',
        component: AddLog,
        meta: {
          hideNavbar: true,
          requiresAuth: true,
         }
      },
      {
        path: '/user/urls',
        name: 'UrlsWs',
        component: UrlsWs,
        meta: { requiresAuth: true },

      },

      

    ]
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  
    const userRole = localStorage.getItem('role')
 
    const hasRequiredRole = to.matched.some(record => 
      record.meta.roles?.includes(userRole)
    )
    console.log(hasRequiredRole);

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'LoginSimp' });
  } else {
    next();
  }

  

});


export default router;