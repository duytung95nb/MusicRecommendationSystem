import scrapy
import uuid
import logging


class Mp3Spider(scrapy.Spider):
    name = "mp3"

    def start_requests(self):
        urls = [
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Tre/IWZ9Z088.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Tru-Tinh/IWZ9Z08B.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Dance/IWZ9Z0CW.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Rap-Viet/IWZ9Z089.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Trinh/IWZ9Z08E.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Thieu-Nhi/IWZ9Z08F.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Cach-Mang/IWZ9Z08C.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Que-Huong/IWZ9Z08D.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Khong-Loi/IWZ9Z090.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Phim/IWZ9Z0BA.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Cai-Luong/IWZ9Z0C6.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Pop/IWZ9Z097.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Rock/IWZ9Z099.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Rap-Hip-Hop/IWZ9Z09B.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Country/IWZ9Z096.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Electronic-Dance/IWZ9Z09A.html",
            "https://mp3.zing.vn/the-loai-nghe-si/R-B-Soul/IWZ9Z09D.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Audiophile/IWZ9Z0EO.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Trance-House-Techno/IWZ9Z0C7.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Phim/IWZ9Z0EC.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Blues-Jazz/IWZ9Z09C.html",
            "https://mp3.zing.vn/the-loai-nghe-si/New-Age-World-Music/IWZ9Z098.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Indie/IWZ9Z0CA.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Folk/IWZ9Z09E.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Christian-Gospel/IWZ9Z0DE.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Han-Quoc/IWZ9Z08W.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhat-Ban/IWZ9Z08Z.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Hoa-Ngu/IWZ9Z08U.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Classical/IWZ9Z0BI.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Piano/IWZ9Z0B0.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Guitar/IWZ9Z0A9.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Violin/IWZ9Z0BU.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Cello/IWZ9Z0AD.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Saxophone/IWZ9Z0B7.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Cu-Dan-Toc/IWZ9Z0AA.html",
            "https://mp3.zing.vn/the-loai-nghe-si/New-Age-World-Music/IWZ9Z0BO.html",
            "https://mp3.zing.vn/the-loai-nghe-si/Nhac-Cu-Khac/IWZ9Z0E8.html"
        ]

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        self.log('Begin of parse() of %s' % response.url)

        # This if statement is for level 1
        if "https://mp3.zing.vn/the-loai-nghe-si" in response.url:
            # Get next page
            pagination = response.xpath('//div[@class="pagination"]').xpath('./ul/li/a')
            for next_page in pagination:
                label = next_page.xpath('./text()').extract_first()
                if label == "Sau":
                    relative_link = next_page.xpath('./@href').extract_first()
                    next_url = "http://mp3.zing.vn" + relative_link
                    yield scrapy.Request(next_url, callback=self.parse)

            # Get artist link and go to level 2
            artist_links = response.xpath('//div[@class="item"]').xpath('./a/@href')
            for relative_link in artist_links.extract():
                next_url = "https://mp3.zing.vn" + relative_link
                yield scrapy.Request(next_url, callback=self.parse)

        # This if statement is for level 2
        elif "https://mp3.zing.vn/nghe-si" in response.url:
            if "bai-hat" in response.url:
                # Get next page
                pagination = response.xpath('//div[@class="pagination"]').xpath('./ul/li/a')
                for next_page in pagination:
                    label = next_page.xpath('./text()').extract_first()
                    if label == "Sau":
                        relative_link = next_page.xpath('./@href').extract_first()
                        next_url = "https://mp3.zing.vn" + relative_link
                        yield scrapy.Request(next_url, callback=self.parse)

                # Get music link and go to level 3
                music_items = response.xpath('//div[@class="list-item full-width"]')
                music_links = music_items.xpath('./ul/li/div[@class="pull-left"]/h3/a/@href')

                for relative_link in music_links.extract():
                    next_url = "https://mp3.zing.vn" + relative_link
                    self.log("Level 3_1: %s" % next_url)
                    yield scrapy.Request(next_url, callback=self.parse)
            else:
                relative_links = response.xpath('//div[@class="tab-menu group"]').xpath('./ul/li/a/@href').extract()
                for relative_link in relative_links:
                    if "bai-hat" in relative_link:
                        next_url = "https://mp3.zing.vn" + relative_link
                        yield scrapy.Request(next_url, callback=self.parse)
                        break

        # This if statement is for level 3
        elif "https://mp3.zing.vn/bai-hat" in response.url:
            song = response.xpath('//div[@class="info-content otr"]/div/h1/text()').extract_first()
            artist = response.xpath('//div[@class="info-content otr"]').xpath('.//a/text()').extract_first()
            composer = response.xpath('//div[@id="composer-container"]/h2/text()').extract_first()
            album = response.xpath('//div[@class="info-song-top otr fl"]').xpath('.//a[@class="txt-info"]/text()').extract_first()
            thumbnail = response.xpath('//div[@class="box-artist"]/a/img/@src').extract_first()
            genres = response.xpath('//div[@class="info-song-top otr clear"]').xpath(".//h2/a/text()").extract()
            lyrics = response.xpath('//div[@class="lyrics-container po-r"]/div/div')[0].xpath('.//p/text()').extract()
            iframe_code = response.url.split("/")[-1].split(".")[0]

            data_song_id = uuid.uuid4().hex
            data_song = ""
            data_artist = ""
            data_composer = ""
            data_album = ""
            data_thumbnail = ""
            data_genre = ""
            data_lyrics = ""

            self.log("Level 3: %s" % response.url)

            if song is not None:
                self.log("Song: %s" % song.strip())
                data_song = song.strip()

            if artist is not None:
                self.log("Artist: %s" % artist.strip())
                data_artist = artist.strip()

            if composer is not None:
                self.log("Composer: %s" % composer.strip())
                data_composer = composer.strip()

            if album is not None:
                self.log("Album: %s" % album.strip())
                data_album = album.strip()

            if thumbnail is not None:
                self.log("Thumbnail: %s" % thumbnail.strip())
                data_thumbnail = thumbnail.strip()

            if lyrics is not None:
                for line in lyrics:
                    if line.strip() != "":
                        data_lyrics = data_lyrics + ". " + line.strip()

            for genre in genres:
                self.log("Genre: %s" % genre.strip())
                data_genre = data_genre + "|" + genre

            yield {
                "id": data_song_id,
                "song": data_song,
                "artist": data_artist,
                "composer": data_composer,
                "album": data_album,
                "genre": data_genre,
                "thumbnail": data_thumbnail,
                "iframe": iframe_code,
                "lyrics": data_lyrics
            }
