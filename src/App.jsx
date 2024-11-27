import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "./components/ui/dialog";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { api } from "./services/api";
import { AddForm } from "./components/forms/registration-form.jsx"
import { EdtForm } from "./components/forms/edt-form";

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

      <div className="border rounded-lg p-2 ">
        <Table>
          <TableHeader>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">Custo</TableHead>
            <TableHead className="text-center">Data Limite</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableHeader>
          <TableBody>
            {tarefas.map((tarefa) => (
              <TableRow key={tarefa.id}>
                <TableCell className="text-center">{tarefa.id}</TableCell>
                <TableCell className="text-center">{tarefa.nome}</TableCell>
                <TableCell className="text-center">{tarefa.custo}</TableCell>
                <TableCell className="text-center">{tarefa.data}</TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-2">
                    <Button className="h-8 w-14" onClick={() => { setOpenEdt(true), handleEditClick(tarefa) }}>Editar</Button>
                    <Button variant="outline" className="h-8 w-14" onClick={() => deleteTarefas(tarefa.id)}>
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openEdt} onOpenChange={setOpenEdt}>
        <DialogContent>
          <EdtForm tarefa={tarefaAtual} onEdit={handleCloseDialog} onEditTarefa={async (name, price, date) => {
            await api.put(`/tarefas/${tarefaAtual.id}`, {
              nome: name,
              custo: price,
              data: date ? format(new Date(date), "dd/MM/yyyy") : null,
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
