import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function ModalComp({ data, setData, editData }) {
    const [name, setName] = useState(editData.name || "")
    const [price, setPrice] = useState(editData.price || "")
    const [date, setDate] = useState(editData.date || "")

    const handleSave = () => {
        if (!name || !price || !date) return;

        // if (nameAlreadyExists()) {
        //     return alert("Tarefa já resgistrada!")
        // }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nova tarefa
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inserção de Tarefas</DialogTitle>
                    </DialogHeader>
                    <DialogClose />

                    <form className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input className="col-span-3" id="name" />
                        </div>

                        <div>
                            <Label htmlFor="price">Custo</Label>
                            <Input className="col-span-3" id="price" />
                        </div>

                        <div className="grid items-center text-left gap-1">
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
        </>
    )
}
