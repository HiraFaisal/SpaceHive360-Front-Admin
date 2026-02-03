"use client";

import { useId } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function NtpSettings() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Timing Configuration */}
            <Card className="col-span-full lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">Reminder Schedule</CardTitle>
                    <CardDescription>Configure when to send Notices to Pay.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ntp-7" className="flex flex-col space-y-1 cursor-pointer">
                            <span>7 Days Before Due Date</span>
                            <span className="font-normal text-xs text-muted-foreground">Early warning notice.</span>
                        </Label>
                        <Switch id="ntp-7" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ntp-3" className="flex flex-col space-y-1 cursor-pointer">
                            <span>3 Days Before Due Date</span>
                            <span className="font-normal text-xs text-muted-foreground">Standard reminder.</span>
                        </Label>
                        <Switch id="ntp-3" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ntp-due" className="flex flex-col space-y-1 cursor-pointer">
                            <span>On Due Date</span>
                            <span className="font-normal text-xs text-muted-foreground">Final notice.</span>
                        </Label>
                        <Switch id="ntp-due" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ntp-overdue" className="flex flex-col space-y-1 cursor-pointer">
                            <span className="text-destructive">Overdue Escalation</span>
                            <span className="font-normal text-xs text-muted-foreground">Daily reminders after due date.</span>
                        </Label>
                        <Switch id="ntp-overdue" />
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Channels */}
            <Card className="col-span-full lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">Delivery Channels</CardTitle>
                    <CardDescription>How members receive their notices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="channel-email">Email Notifications</Label>
                        </div>
                        <Switch id="channel-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="channel-push">In-App Push</Label>
                        </div>
                        <Switch id="channel-push" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="channel-sms">SMS Alerts</Label>
                        </div>
                        <Switch id="channel-sms" />
                    </div>
                </CardContent>
            </Card>

            {/* Action & Templates */}
            <Card className="col-span-full lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg">Configurations</CardTitle>
                    <CardDescription>Manage templates and payment links.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-sm border">
                        <h4 className="font-semibold mb-2">Payment Link Format</h4>
                        <p className="text-muted-foreground mb-3 text-xs">
                            Links are auto-generated. Format: <br />
                            <span className="font-mono text-primary">pay.spacehive.com/inv/InvID</span>
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Preview Email Template</Button>
                    </div>
                    <Button className="w-full">Save Settings</Button>
                </CardContent>
            </Card>
        </div>
    );
}
