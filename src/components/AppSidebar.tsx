 import { Atom, LayoutDashboard, History, Settings, BarChart3, LogOut } from 'lucide-react';
 import { NavLink } from '@/components/NavLink';
 import { useLocation } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarHeader,
   SidebarFooter,
   useSidebar,
 } from '@/components/ui/sidebar';
 
 const navItems = [
   { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
   { title: 'Saved Projects', url: '/history', icon: History },
   { title: 'Usage', url: '/usage', icon: BarChart3 },
   { title: 'Settings', url: '/settings', icon: Settings },
 ];
 
 export function AppSidebar() {
   const { state } = useSidebar();
   const collapsed = state === 'collapsed';
   const location = useLocation();
   const currentPath = location.pathname;
   const { signOut, user } = useAuth();
 
   const isActive = (path: string) => currentPath === path;
 
   return (
     <Sidebar
       className={`${collapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300`}
       collapsible="icon"
     >
       <SidebarHeader className="p-4 border-b border-border">
         <div className="flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
             <Atom className="w-5 h-5 text-primary" />
           </div>
           {!collapsed && (
             <div className="overflow-hidden">
               <h1 className="text-lg font-bold text-foreground truncate">MaterialAI</h1>
               <p className="text-xs text-muted-foreground truncate">Innovation Lab</p>
             </div>
           )}
         </div>
       </SidebarHeader>
 
       <SidebarContent className="flex-1 py-4">
         <SidebarGroup>
           <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {navItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton 
                     asChild 
                     isActive={isActive(item.url)}
                     tooltip={collapsed ? item.title : undefined}
                   >
                     <NavLink
                       to={item.url}
                       className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                   ${isActive(item.url) 
                                     ? 'bg-primary/10 text-primary border border-primary/20' 
                                     : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                     >
                       <item.icon className="w-5 h-5 flex-shrink-0" />
                       {!collapsed && <span className="font-medium">{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>
 
       <SidebarFooter className="p-4 border-t border-border">
         {!collapsed && user && (
           <div className="mb-3 p-2 rounded-lg bg-muted/50">
             <p className="text-xs text-muted-foreground truncate">{user.email}</p>
           </div>
         )}
         <button
           onClick={() => signOut()}
           className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                       text-muted-foreground hover:bg-destructive/10 hover:text-destructive
                       transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
         >
           <LogOut className="w-5 h-5 flex-shrink-0" />
           {!collapsed && <span className="font-medium">Sign Out</span>}
         </button>
       </SidebarFooter>
     </Sidebar>
   );
 }