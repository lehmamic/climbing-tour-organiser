'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NextPage } from 'next';

const formSchema = z.object({
  name: z.string().min(1, 'The group name is required'),
  description: z.string().optional(),
});

const CreateGroupPage: NextPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: values.name, description: values.description }),
    });
  }

  return (
    <main className="flex min-h-screen flex-col sm:container sm:mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-60 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>Name your group.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>Describe your group.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default CreateGroupPage;
