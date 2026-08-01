import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/pwa/components/input-error';
import TextLink from '@/pwa/components/text-link';
import { Button } from '@/pwa/components/ui/button';
import { Input } from '@/pwa/components/ui/input';
import { Label } from '@/pwa/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/pwa/components/ui/select';
import { Textarea } from '@/pwa/components/ui/textarea';
import AuthLayout from '@/pwa/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    whatsapp_number: string;
    birth_place: string;
    birth_date: string;
    gender: string;
    address: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        whatsapp_number: '',
        birth_place: '',
        birth_date: '',
        gender: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6 text-gray-800" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                        <Input
                            id="whatsapp_number"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="whatsapp_number"
                            value={data.whatsapp_number}
                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                            disabled={processing}
                            placeholder="WhatsApp Number"
                        />
                        <InputError message={errors.whatsapp_number} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_place">Place of Birth</Label>
                        <Input
                            id="birth_place"
                            type="text"
                            required
                            tabIndex={4}
                            autoComplete="birth_place"
                            value={data.birth_place}
                            onChange={(e) => setData('birth_place', e.target.value)}
                            disabled={processing}
                            placeholder="Place of Birth"
                        />
                        <InputError message={errors.birth_place} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_date">Date of Birth</Label>
                        <Input
                            id="birth_date"
                            type="date"
                            required
                            tabIndex={5}
                            autoComplete="birth_date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            disabled={processing}
                            placeholder="Date of Birth"
                        />
                        <InputError message={errors.birth_date} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>

                        <Select value={data.gender} onValueChange={(value) => setData({ ...data, gender: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-300 bg-white">
                                <SelectGroup>
                                    <SelectLabel className="text-black">Gender</SelectLabel>
                                    <SelectItem value="male" className="text-black">
                                        Male
                                    </SelectItem>
                                    <SelectItem className="text-black hover:bg-white" value="female">
                                        Female
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.gender} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            required
                            tabIndex={6}
                            autoComplete="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            placeholder="Address"
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={8}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={9} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={10} className="font-bold text-teal-600">
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
