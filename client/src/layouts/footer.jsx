function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-white dark:border-black">
            <span className="text-sm text-white sm:text-center dark:text-black">
                © 2024.Đồ án chuyên ngành
            </span>
            <ul className="flex space-x-4 items-center text-sm font-medium text-black sm:mt-0">
                <li>
                    <a href="/location" className="hover:underline text-black">Địa điểm</a>
                </li>
                <li>
                    <a href="/cultural" className="hover:underline text-black">Văn hóa</a>
                </li>
                <li>
                    <a href="/history" className="hover:underline text-black">Lịch sử</a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;
