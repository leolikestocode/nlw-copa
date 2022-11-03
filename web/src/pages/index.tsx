import Image from "next/image"

import nlwCopaPreviewImg from "../assets/app-nlw-copa-preview.png"
import logoImg from "../assets/logo.svg"
import userExampleImg from "../assets/users-avatar-example.png"
import iconCheckImg from "../assets/icon-check.svg"
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  poolsCount: number
  guessesCount: number
  userCount: number
}

export default function Home({
  poolsCount,
  guessesCount,
  userCount,
}: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("")

  async function sendPool(e: FormEvent) {
    e.preventDefault()

    const res = await api.post("/pools", {
      title: poolTitle,
    })

    await navigator.clipboard.writeText(res.data.code)

    alert(
      "Bolão criado com sucesso!!! O código foi copiado para a área de transferência."
    )
    setPoolTitle("")
  }

  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userExampleImg} alt="users" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={sendPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            required
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="check mark" />
            <div className="text-white flex flex-col">
              <span className="font-bold text-2xl">{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="check mark" />
            <div className="text-white flex flex-col">
              <span className="font-bold text-2xl">{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={nlwCopaPreviewImg}
        alt="dois celulares exibindo uma imagem da copa"
        quality={100}
      />
    </div>
  )
}

export async function getServerSideProps() {
  const [poolCountResponse, guessesCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ])

  return {
    props: {
      poolsCount: poolCountResponse.data,
      guessesCount: guessesCountResponse.data,
      userCount: userCountResponse.data,
    },
  }
}
