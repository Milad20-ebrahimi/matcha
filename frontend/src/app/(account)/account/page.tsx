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

setFirstName(
  profile.firstName ?? ""
);

setLastName(
  profile.lastName ?? ""
);

setEmail(
  profile.email ?? ""
);

setDateOfBirth(
  profile.profile?.dateOfBirth ?? ""
);

setJob(
  profile.profile?.job ?? ""
);

setBio(
  profile.profile?.bio ?? ""
);

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
    dateOfBirth:
      dateOfBirth || null,
    job:
      job || null,
    bio:
      bio || null,
    avatarUrl:
      avatarUrl || null,
  });

  setSuccess(
    "اطلاعات پروفایل با موفقیت ذخیره شد."
  );
} catch {
  // خطا توسط ProfileProvider مدیریت می‌شود.
}

}

if (isLoading) {
return (
<main
style={{
minHeight: "100vh",
padding: "40px 20px",
}}
> <h1>در حال دریافت پروفایل...</h1> </main>
);
}

if (!profile) {
return (
<main
style={{
minHeight: "100vh",
padding: "40px 20px",
}}
> <h1>پروفایل پیدا نشد.</h1>
    {error && (
      <p
        style={{
          color: "red",
        }}
      >
        {error}
      </p>
    )}
  </main>
);

}

return (
<main
dir="rtl"
style={{
minHeight: "100vh",
padding: "40px 20px",
}}
>
<div
style={{
width: "100%",
maxWidth: "900px",
margin: "0 auto",
}}
>
<header
style={{
marginBottom: "32px",
}}
> <h1>
حساب کاربری من </h1>

      <p>
        اطلاعات شخصی و پروفایل خود را مدیریت کنید.
      </p>
    </header>

    <section
      style={{
        marginBottom: "32px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
      }}
    >
      <h2>
        اطلاعات حساب
      </h2>

      <p>
        شماره موبایل:{" "}
        <strong dir="ltr">
          {profile.phone}
        </strong>
      </p>

      <p>
        وضعیت موبایل:{" "}
        {profile.phoneVerified
          ? "تأیید شده"
          : "تأیید نشده"}
      </p>
    </section>

    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "20px",
      }}
    >
      <section
        style={{
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "16px",
        }}
      >
        <h2>
          اطلاعات شخصی
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <label>
            نام
            <input
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>

          <label>
            نام خانوادگی
            <input
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>

          <label>
            ایمیل
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>

          <label>
            تاریخ تولد
            <input
              type="date"
              dir="ltr"
              value={dateOfBirth}
              onChange={(event) =>
                setDateOfBirth(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>

          <label>
            شغل
            <input
              type="text"
              value={job}
              onChange={(event) =>
                setJob(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>

          <label>
            آدرس تصویر پروفایل
            <input
              type="url"
              dir="ltr"
              value={avatarUrl}
              onChange={(event) =>
                setAvatarUrl(
                  event.target.value
                )
              }
              disabled={isUpdating}
            />
          </label>
        </div>

        <label
          style={{
            display: "block",
            marginTop: "16px",
          }}
        >
          درباره من

          <textarea
            value={bio}
            onChange={(event) =>
              setBio(
                event.target.value
              )
            }
            disabled={isUpdating}
            rows={5}
          />
        </label>
      </section>

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            color: "green",
          }}
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isUpdating}
      >
        {isUpdating
          ? "در حال ذخیره..."
          : "ذخیره تغییرات"}
      </button>
    </form>
  </div>
</main>

);
}
