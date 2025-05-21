"use client"

import { useState, useMemo } from "react"
import { useCart } from "@/providers/cart"
import { useRegion } from "@/providers/region"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"

type AddressProps = {
    isActive: boolean
}

export const Address = ({
    isActive,
}: AddressProps) => {
    const { cart, updateCart } = useCart()
    const { region } = useRegion()
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState(
        cart?.shipping_address?.first_name || ""
    )
    const [lastName, setLastName] = useState(
        cart?.shipping_address?.last_name || ""
    )
    const [email, setEmail] = useState(cart?.email || "")
    const [phone, setPhone] = useState(cart?.shipping_address?.phone || "")
    const [address, setAddress] = useState(
        cart?.shipping_address?.address_1 || ""
    )
    const [postalCode, setPostalCode] = useState(
        cart?.shipping_address?.postal_code || ""
    )
    const [city, setCity] = useState(cart?.shipping_address?.city || "")
    const [country, setCountry] = useState(
        cart?.shipping_address?.country_code || region?.countries?.[0]?.iso_2 || ""
    )
    const router = useRouter()

    const isButtonDisabled = useMemo(() => {
        return loading || !firstName || !lastName || !email ||
            !phone || !address || !postalCode || !city || !country
    }, [
        firstName, lastName, email, phone, address,
        postalCode, city, country, loading,
    ])

    // Check if address is complete with all required fields
    const isAddressComplete = useMemo(() => {
        // First check if cart exists
        if (!cart) return false;

        // Then check if shipping_address exists
        if (!cart.shipping_address) return false;

        // Finally check all required fields in shipping address
        return Boolean(
            cart.shipping_address.first_name &&
            cart.shipping_address.last_name &&
            cart.email &&
            cart.shipping_address.phone &&
            cart.shipping_address.address_1 &&
            cart.shipping_address.postal_code &&
            cart.shipping_address.city &&
            cart.shipping_address.country_code &&
            // Check for billing address and its required fields
            cart.billing_address &&
            cart.billing_address.first_name &&
            cart.billing_address.last_name &&
            cart.billing_address.address_1 &&
            cart.billing_address.postal_code &&
            cart.billing_address.city &&
            cart.billing_address.country_code
        );
    }, [cart])

    const handleSubmit = () => {
        if (isButtonDisabled) {
            return
        }

        setLoading(true)

        updateCart({
            updateData: {
                shipping_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    address_1: address,
                    postal_code: postalCode,
                    city,
                    country_code: country,
                },
                billing_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    address_1: address,
                    postal_code: postalCode,
                    city,
                    country_code: country,
                },
                email,
            },
        })
            .then(() => {
                setLoading(false)
                router.push(`/checkout?step=shipping`)
            })
    }

    if (!isActive && isAddressComplete) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Delivery Address</h3>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {cart?.shipping_address?.first_name} {cart?.shipping_address?.last_name}, {cart?.shipping_address?.address_1},
                            {cart?.shipping_address?.city}, {cart?.shipping_address?.postal_code}, {cart?.shipping_address?.country_code}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => router.push("/checkout?step=address")}>
                        Edit
                    </Button>
                </div>
            </div>
        )
    }

    if (!isActive) {
        return null
    }

    return (
        <div className="border p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <span className="text-sm font-medium">Contact</span>
                    <div className="flex gap-4">
                        <Input
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                        />
                        <Input
                            name="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                        />
                    </div>
                    <Input
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <Input
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-sm font-medium">Delivery</span>
                    <Input
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                    <div className="flex gap-4">
                        <Input
                            name="postal_code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="Postal code"
                        />
                        <Input
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                    </div>
                    <Select
                        value={country}
                        onValueChange={(value) => setCountry(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {region?.countries?.map((country) => (
                                <SelectItem
                                    key={country.iso_2}
                                    value={country.iso_2 || ""}
                                >
                                    {country.display_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Separator className="my-2" />
                <Button
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                    className="w-full"
                    variant="default"
                >
                    Continue to Shipping
                </Button>
            </div>
        </div>
    )
}