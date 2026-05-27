(function scrapeMazii() {
    let vocabList = [];
    
    // Tìm tất cả các phần tử có class ng-star-inserted (thường là các hàng/row chứa từ vựng)
    let rows = document.querySelectorAll('.ng-star-inserted');

    rows.forEach(row => {
        // Tìm các thành phần con bên trong mỗi hàng
        let kanjiEl = row.querySelector('.wc-kanji');
        let kanaEl = row.querySelector('.wc-kana');
        let meanEl = row.querySelector('.wc-meaning');
        let hanvietEl = row.querySelector('.wc-hanviet');

        // Nếu hàng này thực sự chứa từ vựng và nghĩa thì mới lấy
        if (kanjiEl && meanEl) {
            let word = kanjiEl.innerText.trim();
            let furigana = kanaEl ? kanaEl.innerText.trim() : '';
            let meaning = meanEl.innerText.trim();
            
            // Xử lý Hán tự: lấy text và xóa các dấu ngoặc vuông [] nếu có
            let kanji = hanvietEl ? hanvietEl.innerText.replace(/\[|\]/g, '').trim() : '';

            vocabList.push({ word, furigana, kanji, meaning });
        }
    });

    // Lọc trùng lặp (đề phòng Angular sinh ra các node ng-star-inserted lồng nhau)
    let uniqueVocab = Array.from(new Set(vocabList.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));

    if (uniqueVocab.length > 0) {
        console.log(`🎉 Đã cào thành công ${uniqueVocab.length} từ vựng!`, uniqueVocab);

        // Tự động tạo và tải file JSON về máy
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(uniqueVocab, null, 4));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "mazii_n2_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } else {
        console.error("❌ Không tìm thấy từ vựng nào! Vui lòng đảm bảo bạn đang ở tab Console của trình duyệt và trang web đã load xong từ vựng.");
    }
})();