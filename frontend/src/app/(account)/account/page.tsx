"use client";

import {
useEffect,
useState,
} from "react";

import {
useProfileContext,
} from "@/features/profile/profile.context";

export default function AccountPage() {
const {
profile,
isLoading,
isUpdating,
error,
updateProfileData,
} = useProfileContext();

const [firstName, setFirstName] =
useState("");

const [lastName, setLastName] =
useState("");

const [email, setEmail] =
useState("");

const [dateOfBirth, setDateOfBirth] =
useState("");

const [job, setJob] =
useState("");

const [bio, setBio] =
useState("");

const [avatarUrl, setAvatarUrl] =
useState("");

const [success, setSuccess] =
useState("");

useEffect(() => {
if (!profile) {
return;
}

setFirstName(profile.firstName ?? "");
setLastName(profile.lastName ?? "");
setEmail(profile.email ?? "");
setDateOfBirth(
  profile.profile?.dateOfBirth ?? ""
);
setJob(profile.profile?.job ?? "");
setBio(profile.profile?.bio ?? "");
setAvatarUrl(
  profile.profile?.avatarUrl ?? ""
);


}, [profile]);

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();


setSuccess("");

try {
  await updateProfileData({
    firstName,
    lastName,
    email,
    dateOfBirth: dateOfBirth || null,
    job: job || null,
    bio: bio || null,
    avatarUrl: avatarUrl || null,
  });

  setSuccess(
    "اطلاعات پروفایل با موفقیت ذخیره شد."
  );
} catch {
  // خطا توسط ProfileProvider مدیریت می‌شود.
}


}

if (isLoading) {
return ( <div className="rounded-[32px] border border-[#b9d19a]/30 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(13,26,18,0.30)]"> <p className="text-sm text-[#203c27]/60">
در حال دریافت اطلاعات پروفایل... </p> </div>
);
}

if (!profile) {
return ( <div className="rounded-[32px] border border-[#b9d19a]/30 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(13,26,18,0.30)]"> <h2 className="text-2xl font-light text-[#203c27]">
پروفایل پیدا نشد. </h2>


    {error && (
      <p className="mt-4 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);


}

return ( <div className="space-y-8">
{/* Account Information */} <section className="overflow-hidden rounded-[32px] border border-[#b9d19a]/30 bg-white/80 shadow-[0_30px_80px_-40px_rgba(13,26,18,0.30)] backdrop-blur-xl"> <div className="border-b border-[#0d1a12]/10 px-6 py-6 sm:px-8"> <p className="text-xs tracking-[0.25em] text-[#d97706]">
ACCOUNT </p>


      <h2 className="mt-2 text-2xl font-light text-[#203c27]">
        اطلاعات حساب
      </h2>

      <p className="mt-2 text-sm text-[#203c27]/55">
        اطلاعات اصلی حساب کاربری شما
      </p>
    </div>

    <div className="grid gap-4 px-6 py-6 sm:px-8 sm:grid-cols-2">
      <div className="rounded-2xl bg-[#f8f5ed] p-5">
        <p className="text-xs text-[#203c27]/50">
          شماره موبایل
        </p>

        <p
          dir="ltr"
          className="mt-2 text-sm font-semibold text-[#203c27]"
        >
          {profile.phone || "ثبت نشده"}
        </p>
      </div>

      <div className="rounded-2xl bg-[#f8f5ed] p-5">
        <p className="text-xs text-[#203c27]/50">
          وضعیت موبایل
        </p>

        <p className="mt-2 text-sm font-semibold text-[#203c27]">
          {profile.phoneVerified
            ? "تأیید شده"
            : "تأیید نشده"}
        </p>
      </div>
    </div>
  </section>

  {/* Personal Information */}
  <section className="overflow-hidden rounded-[32px] border border-[#b9d19a]/30 bg-white/80 shadow-[0_30px_80px_-40px_rgba(13,26,18,0.30)] backdrop-blur-xl">
    <div className="border-b border-[#0d1a12]/10 px-6 py-6 sm:px-8">
      <p className="text-xs tracking-[0.25em] text-[#d97706]">
        PROFILE
      </p>

      <h2 className="mt-2 text-2xl font-light text-[#203c27]">
        اطلاعات شخصی
      </h2>

      <p className="mt-2 text-sm text-[#203c27]/55">
        اطلاعات پروفایل خود را مدیریت کنید.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="px-6 py-6 sm:px-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            نام
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            نام خانوادگی
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            ایمیل
          </label>

          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-left text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            تاریخ تولد
          </label>

          <input
            type="date"
            dir="ltr"
            value={dateOfBirth}
            onChange={(event) =>
              setDateOfBirth(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-left text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            شغل
          </label>

          <input
            type="text"
            value={job}
            onChange={(event) =>
              setJob(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#203c27]">
            آدرس تصویر پروفایل
          </label>

          <input
            type="url"
            dir="ltr"
            value={avatarUrl}
            onChange={(event) =>
              setAvatarUrl(event.target.value)
            }
            disabled={isUpdating}
            className="w-full rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-left text-sm text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-[#203c27]">
          درباره من
        </label>

        <textarea
          value={bio}
          onChange={(event) =>
            setBio(event.target.value)
          }
          disabled={isUpdating}
          rows={5}
          className="w-full resize-none rounded-2xl border border-[#203c27]/10 bg-[#f8f5ed]/60 px-4 py-3.5 text-sm leading-7 text-[#203c27] outline-none transition focus:border-[#355e3b] focus:bg-white disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-2xl bg-[#355e3b]/10 px-4 py-3 text-sm text-[#355e3b]">
          {success}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isUpdating}
          className="rounded-2xl bg-[#203c27] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#355e3b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating
            ? "در حال ذخیره..."
            : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  </section>
</div>

);
}

