import Image from "next/image";

export default function SaoMiguel() {
    return (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
            <Image alt="São Miguel do Guaporé" width={100} height={100} src="/brasao_cidade.png" />
            <p>Prefeitura Municipal<br />São Miguel do Guaporé-RO</p>
        </div>
    )
}
