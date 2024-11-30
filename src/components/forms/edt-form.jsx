import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { api } from "@/services/api";

const formSchema = z.object({
    name: z.string().min(1, { message: "O nome não pode estar vazio." }),
    price: z.string().min(1, { message: "O custo não pode estar vazio." }).refine((val) => !isNaN(Number(val)), { message: "O custo deve ser um número." }),
    date: z.string().min(1, { message: "A data não pode estar vazia." })
})

export function EdtForm({ tarefa, onEdit, onEditTarefa }) {
    const [date, setDate] = useState();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: tarefa.nome,
            price: tarefa.custo.toString(),
            date: tarefa.data,
        },
    })

    async function onSubmit(values) {
        try {
            await onEditTarefa(values.name, values.price, values.date)
            onEdit()
        } catch (error) {
            if (error.response && error.response.status === 409) {
                form.setError('name', {
                    message: 'Esse nome de tarefa já está em uso. Tente outro.',
                });
            } else {
                console.error('Erro ao enviar os dados:', error);
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite um nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custo</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite um custo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="grid items-center text-left gap-2">
                            <FormLabel>Data Limite</FormLabel>
                            <FormControl>
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "col-span-3 justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "dd/MM/yyyy") : <span>{tarefa.data}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(selectedDate) => {
                                                setDate(selectedDate);
                                                form.setValue("date", selectedDate ? selectedDate.toISOString() : "");
                                                setIsPopoverOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-1">
                    <Button type="submit" className="w-[65px] box-border px-4 py-2">Editar</Button>
                    <Button type="button" variant="outline" onClick={onEdit} className="w-[65px] box-border px-4 py-2">Cancelar</Button>
                </div>
            </form>
        </Form>
    );
}
