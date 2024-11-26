import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { PlusCircle, CalendarIcon, EditIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";
import { useEffect, useState, useRef, useReducer } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "./services/api";
import { AddForm } from "./components/forms/registration-form.jsx"

export function App() {
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const [date, setDate] = useState();
  const [tarefas, setTarefas] = useState([]);

  async function getTarefas() {
    const tarefasFromApi = await api.get('/tarefas')

    setTarefas(tarefasFromApi.data)
  }

  useEffect(() => {
    getTarefas()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Tarefas</h1>

      <div className="border rounded-lg p-2 ">
        <Table>
          <TableHeader>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Ordem</TableHead>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">Custo</TableHead>
            <TableHead className="text-center">Data Limite</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableHeader>
          <TableBody>
            {tarefas.map((tarefa) => (
              <TableRow key={tarefa.id}>
                <TableCell className="text-center">{tarefa.id}</TableCell>
                <TableCell className="text-center">{tarefa.ordem}</TableCell>
                <TableCell className="text-center">{tarefa.nome}</TableCell>
                <TableCell className="text-center">{tarefa.custo}</TableCell>
                <TableCell className="text-center">{tarefa.data}</TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="h-8 w-14">
                          Editar
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edição de Tarefas</DialogTitle>
                        </DialogHeader>

                        <div className="border-t border-muted-foreground my-2 border-gray-200" />

                        <form className="flex flex-col gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input className="col-span-3 select-none" id="name" />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="price">Custo</Label>
                            <Input className="col-span-3" id="price" />
                          </div>

                          <div className="grid items-center text-left gap-2">
                            <Label htmlFor="date">Data</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "col-span-3 justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : <span></span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                          </DialogFooter>
                        </form>

                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="h-8 w-14">
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova tarefa
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <AddForm onSave={handleCloseDialog} onAddTarefa={async (name, price, date) => {
              await api.post('/tarefas', {
                nome: name,
                custo: price,
                data: date ? format(new Date(date), "dd/MM/yyyy") : null,
              });
              await getTarefas();
            }} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
