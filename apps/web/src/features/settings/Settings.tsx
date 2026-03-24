import { useState } from "react";
import {
  Button,
  Divider,
  Input,
  Label,
  Switch,
  Textarea,
} from "@/components/atoms";
import { Card } from "@/components/molecules";
import "./Settings.scss";

export default function Settings() {
  // State for various settings
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
  });
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    searchEngine: false,
  });
  const [appearance, setAppearance] = useState("system");

  return (
    <div className="settings-page">
      <Card className="shadow-2xl" variant="header" title="Settings">
        <div className="space-y-10">
          {/* Profile Section */}
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" label="Name" />
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label htmlFor="avatar" label="Avatar URL" />
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={(e) =>
                    setProfile({ ...profile, avatar: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio" label="Bio" />
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </section>
          <Divider />
          {/* Account Section */}
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              Account
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" label="Email" />
                <Input
                  id="email"
                  type="email"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({ ...account, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password" label="Password" />
                <Input
                  id="password"
                  type="password"
                  value={account.password}
                  onChange={(e) =>
                    setAccount({ ...account, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>
          <Divider />
          {/* Notifications Section */}
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label label="Email Notifications" />
                <Switch
                  checked={notifications.email}
                  onChange={(v) =>
                    setNotifications({ ...notifications, email: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label label="SMS Notifications" />
                <Switch
                  checked={notifications.sms}
                  onChange={(v) =>
                    setNotifications({ ...notifications, sms: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label label="Push Notifications" />
                <Switch
                  checked={notifications.push}
                  onChange={(v) =>
                    setNotifications({ ...notifications, push: v })
                  }
                />
              </div>
            </div>
          </section>
          <Divider />
          {/* Privacy Section */}
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              Privacy
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label label="Profile Visible" />
                <Switch
                  checked={privacy.profileVisible}
                  onChange={(v) =>
                    setPrivacy({ ...privacy, profileVisible: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label label="Allow Search Engines" />
                <Switch
                  checked={privacy.searchEngine}
                  onChange={(v) => setPrivacy({ ...privacy, searchEngine: v })}
                />
              </div>
            </div>
          </section>
          <Divider />
          {/* Appearance Section */}
          <section>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              Appearance
            </h2>
            <select
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-400 rounded-md bg-neutral-50 text-neutral-900"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </section>
          <Divider />
          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-primary-500 hover:bg-primary-700 text-neutral-50 font-semibold">
              Save All Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}