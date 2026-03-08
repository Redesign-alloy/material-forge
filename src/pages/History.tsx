 import { useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { History as HistoryIcon, Search, Calendar, ChevronRight, X, FileText, Atom } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { useAuth } from '@/contexts/AuthContext';
 import { supabase } from '@/integrations/supabase/client';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { DisplayDataRenderer } from '@/components/DisplayDataRenderer';
 
 interface HistoryItem {
   id: string;
   grade_name: string;
   redesign_data: Record<string, unknown>;
   created_at: string;
 }
 
 export default function History() {
   const [items, setItems] = useState<HistoryItem[]>([]);
   const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [loading, setLoading] = useState(true);
   const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
   const { user } = useAuth();
 
   useEffect(() => {
     const fetchHistory = async () => {
       if (!user?.id) return;
       
       try {
          const { data, error } = await supabase
            .from('material_innovation_data')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setItems(data || []);
          setFilteredItems(data || []);
       } catch (err) {
         console.error('Failed to fetch history:', err);
       } finally {
         setLoading(false);
       }
     };
 
     fetchHistory();
   }, [user]);
 
   useEffect(() => {
     if (searchQuery) {
       const filtered = items.filter(item =>
         item.grade_name?.toLowerCase().includes(searchQuery.toLowerCase())
       );
       setFilteredItems(filtered);
     } else {
       setFilteredItems(items);
     }
   }, [searchQuery, items]);
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   return (
     <div className="max-w-6xl mx-auto">
       <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
       >
         <div className="flex items-center gap-3 mb-2">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
             <HistoryIcon className="w-5 h-5 text-primary" />
           </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Saved Projects
            </h1>
          </div>
          <p className="text-muted-foreground">
            View and search your saved material analyses
          </p>
       </motion.div>
 
       {/* Search Bar */}
       <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="mb-6"
       >
         <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
           <Input
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by material or asset name..."
             className="pl-11 h-12 input-field"
           />
         </div>
       </motion.div>
 
       {/* History List */}
       {loading ? (
         <div className="space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="glass-panel p-6 animate-pulse">
               <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
               <div className="h-4 bg-muted rounded w-1/4"></div>
             </div>
           ))}
         </div>
       ) : filteredItems.length === 0 ? (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="glass-panel p-12 text-center"
         >
           <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
           <h3 className="text-lg font-semibold text-foreground mb-2">No analyses found</h3>
           <p className="text-muted-foreground">
             {searchQuery 
               ? 'Try a different search term' 
               : 'Run your first analysis from the Dashboard'}
           </p>
         </motion.div>
       ) : (
         <div className="space-y-3">
           <AnimatePresence>
             {filteredItems.map((item, index) => (
               <motion.button
                 key={item.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ delay: index * 0.05 }}
                 onClick={() => setSelectedItem(item)}
                 className="w-full glass-panel p-5 hover:border-primary/30 transition-all duration-200 
                            flex items-center justify-between group text-left"
               >
                 <div className="flex items-center gap-4">
                   <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                     <Atom className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                       {item.grade_name || 'Untitled Analysis'}
                     </h3>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                       <Calendar className="w-4 h-4" />
                       <span>{formatDate(item.created_at)}</span>
                     </div>
                   </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary 
                                          group-hover:translate-x-1 transition-all" />
               </motion.button>
             ))}
           </AnimatePresence>
         </div>
       )}
 
       {/* Detail Modal */}
       <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
         <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
           <DialogHeader className="p-6 pb-4 border-b border-border">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                   <Atom className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <DialogTitle className="text-xl font-bold">
                     {selectedItem?.grade_name || 'Analysis Details'}
                   </DialogTitle>
                   {selectedItem && (
                     <p className="text-sm text-muted-foreground mt-1">
                       {formatDate(selectedItem.created_at)}
                     </p>
                   )}
                 </div>
               </div>
             </div>
           </DialogHeader>
           <ScrollArea className="max-h-[calc(85vh-120px)]">
             <div className="p-6">
              {selectedItem?.redesign_data && (
                  <DisplayDataRenderer 
                    data={
                      (selectedItem.redesign_data as Record<string, unknown>)?.display_data 
                        ? (selectedItem.redesign_data as Record<string, unknown>).display_data as Record<string, unknown>
                        : selectedItem.redesign_data as Record<string, unknown>
                    } 
                  />
                )}
             </div>
           </ScrollArea>
         </DialogContent>
       </Dialog>
     </div>
   );
 }