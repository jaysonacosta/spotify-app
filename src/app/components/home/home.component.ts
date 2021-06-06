import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  search: Search = {
    artistName: '',
  };

  user: User = {
    name: '',
    email: '',
    id: '',
    country: '',
  };

  topArtists: TopArtists = {
    artists: [],
  };

  recentTracks: RecentTracks = {
    tracks: [],
  };

  private accessToken: any;

  constructor(
    private spotifyService: SpotifyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (localStorage.length === 0) {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.spotifyService.accessTokenExchange(params.code).subscribe(
          (res: any) => {
            console.log(res);
            this.accessToken = res.access_token;
            localStorage.setItem('access_token', this.accessToken);
          },
          (err) => {
            console.log(err);
            this.router.navigate(['']);
          }
        );
      });
    } else {
      this.accessToken = localStorage.getItem('access_token');
      this.spotifyService.getCurrentUser(this.accessToken).subscribe(
        (res) => {
          return;
        },
        (err) => {
          localStorage.clear();
          this.router.navigate(['']);
        }
      );
    }
    this.getCurrentUser(this.accessToken);
    this.getTopArtists(this.accessToken);
    this.getRecentTracks(this.accessToken);
    this.getArtistFollowState(this.accessToken);
    console.log(this.topArtists);
    console.log(this.accessToken);
  }

  getCurrentUser(accessToken: string): void {
    this.spotifyService.getCurrentUser(accessToken).subscribe(
      (res: any) => {
        this.user.name = res.display_name;
        this.user.email = res.email;
        this.user.id = res.id;
        this.user.country = res.country;
      },
      (err) => {
        this.router.navigate(['']);
      }
    );
  }

  getTopArtists(accessToken: string): void {
    this.spotifyService.getTopArtists(accessToken).subscribe(
      (res: any) => {
        for (let i = 0; i < 9; i++) {
          const entry = res.items[i];
          const id = entry.uri.substring(15);
          const artist: Artist = {
            name: entry.name,
            totalFollowers: entry.followers.total,
            genres: entry.genres[0],
            imageUrl: entry.images[0].url,
            id,
          };
          this.topArtists.artists.push(artist);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getRecentTracks(accessToken: string): void {
    this.spotifyService.getRecentTracks(accessToken).subscribe(
      (res: any) => {
        for (let i = 0; i < 3; i++) {
          const entry = res.items[i];
          const track: Track = {
            trackName: entry.track.name,
            artist: entry.track.artists[0].name,
            albumName: entry.track.album.name,
            imageUrl: entry.track.album.images[0].url,
          };
          this.recentTracks.tracks.push(track);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getArtistFollowState(accessToken: string): void {
    console.log(this.topArtists.artists.length);
    for (const artist of this.topArtists.artists) {
      console.log(artist);
      this.spotifyService
        .getArtistFollowState(accessToken, artist.id)
        .subscribe(
          (res: any) => {
            const following: boolean = res[0];
            artist.following = following;
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}

interface Search {
  artistName: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  country: string;
}

interface TopArtists {
  artists: Artist[];
}

interface Artist {
  name: string;
  totalFollowers: number;
  genres: string[];
  imageUrl: string;
  id: string;
  following?: boolean;
}

interface RecentTracks {
  tracks: Track[];
}

interface Track {
  trackName: string;
  artist: string;
  albumName: string;
  imageUrl: string;
}
