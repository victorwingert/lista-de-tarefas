import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { ArrowDown, ArrowUpIcon, DeleteIcon, Edit2Icon, Edit3Icon, PlusCircle, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./components/ui/dialog";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { api } from "./services/api";
import { AddForm } from "./components/forms/registration-form.jsx"
import { EdtForm } from "./components/forms/edt-form";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogDescription } from "@radix-ui/react-dialog";

export function App() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdt, setOpenEdt] = useState(false);
  const [tarefas, setTarefas] = useState([]);
  const [tarefaAtual, setTarefaAtual] = useState(null);

  const handleCloseDialog = () => {
    setOpenAdd(false)
    setOpenEdt(false)
  }

  const handleEditClick = (tarefa) => {
    setTarefaAtual(tarefa)
    setOpenEdt(true)
  }

  const handleMoveUp = async (tarefa) => {
    const tarefaAnterior = tarefas.find((t) => t.ordem === tarefa.ordem - 1);

    await api.patch(`/tarefas/${tarefa.id}`, { ordem: -1 });
    await api.patch(`/tarefas/${tarefaAnterior.id}`, { ordem: -2 });

    const temp = tarefa.ordem;
    tarefa.ordem = tarefaAnterior.ordem;
    tarefaAnterior.ordem = temp;

    await api.patch(`/tarefas/${tarefa.id}`, { ordem: tarefa.ordem });
    await api.patch(`/tarefas/${tarefaAnterior.id}`, { ordem: tarefaAnterior.ordem });

    setTarefas([...tarefas]);
  };

  const handleMoveDown = async (tarefa) => {
    const tarefaSeguinte = tarefas.find((t) => t.ordem === tarefa.ordem + 1);

    await api.patch(`/tarefas/${tarefa.id}`, { ordem: -1 });
    await api.patch(`/tarefas/${tarefaSeguinte.id}`, { ordem: -2 });

    const temp = tarefa.ordem;
    tarefa.ordem = tarefaSeguinte.ordem;
    tarefaSeguinte.ordem = temp;

    await api.patch(`/tarefas/${tarefa.id}`, { ordem: tarefa.ordem });
    await api.patch(`/tarefas/${tarefaSeguinte.id}`, { ordem: tarefaSeguinte.ordem });

    setTarefas([...tarefas]);
  };

  async function getTarefas() {
    const tarefasFromApi = await api.get('/tarefas')

    setTarefas(tarefasFromApi.data)
  }

  async function deleteTarefas(id) {
    await api.delete(`/tarefas/${id}`)

    getTarefas()
  }

  useEffect(() => {
    getTarefas()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Tarefas</h1>

      <div className="border-2 border-black rounded-lg p-0 ">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black">
              <TableHead className="text-center font-bold">ID</TableHead>
              <TableHead className="text-center font-bold">Nome</TableHead>
              <TableHead className="text-center font-bold">Custo</TableHead>
              <TableHead className="text-center font-bold">Data Limite</TableHead>
              <TableHead className="text-center font-bold">Ordem</TableHead>
              <TableHead className="text-center font-bold w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarefas
              .sort((a, b) => a.ordem - b.ordem)
              .map((tarefa) => (
                <TableRow key={tarefa.id} className={` border-b border-black text-center ${tarefa.custo >= 1000 ? 'bg-maize hover:bg-maize hover:bg-opacity-80' : ''}`}>
                  <TableCell className="text-center">{tarefa.id}</TableCell>
                  <TableCell className="text-center">{tarefa.nome}</TableCell>
                  <TableCell className="text-center">{tarefa.custo}</TableCell>
                  <TableCell className="text-center">{tarefa.data}</TableCell>
                  <TableCell className="text-center">{tarefa.ordem}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-3">
                      <div className="flex justify-center items-center gap-1">
                        <Button className="h-8 w-8 rounded-full bg-redwood hover:bg-redwood hover:bg-opacity-80" onClick={() => { handleMoveUp(tarefa) }} disabled={tarefa.ordem === 1}>
                          <ArrowUpIcon></ArrowUpIcon>
                        </Button>
                        <Button className="h-8 w-8 rounded-full bg-redwood hover:bg-redwood hover:bg-opacity-80" onClick={() => { handleMoveDown(tarefa) }} disabled={tarefa.ordem === tarefas.length}>
                          <ArrowDown></ArrowDown>
                        </Button>
                      </div>
                      <div className="flex justify-center items-center gap-1">
                        <Button className="h-8 w-8 rounded-full bg-blue-gray hover:bg-blue-gray hover:bg-opacity-80" onClick={() => { setOpenEdt(true), handleEditClick(tarefa) }}>
                          <Edit2Icon></Edit2Icon>
                        </Button>
                        <Button className="h-8 w-8 rounded-full bg-vermilion hover:bg-vermilion hover:bg-opacity-80" onClick={() => deleteTarefas(tarefa.id)}>
                          <TrashIcon></TrashIcon>
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openEdt} onOpenChange={setOpenEdt}>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
          <EdtForm tarefa={tarefaAtual} onEdit={handleCloseDialog} onEditTarefa={async (name, price, date) => {
            await api.put(`/tarefas/${tarefaAtual.id}`, {
              nome: name,
              custo: price,
              data: date.includes('T') ? format(new Date(date), "dd/MM/yyyy") : date,
            });
            await getTarefas();
          }} />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <Button onClick={() => setOpenAdd(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />Incluir Registro
        </Button>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent>
            <VisuallyHidden>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </VisuallyHidden>
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
