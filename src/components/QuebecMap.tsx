import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";

export type QuebecLocation = {
	id: string;
	name: string;
	description: string;
	duration: string;
	position: [number, number];
};

const MONTREAL_CENTER: [number, number] = [45.5017, -73.5673];

const pinkPin = L.divIcon({
	className: "quebecPin",
	html: '<span class="quebecPin__core"></span>',
	iconSize: [28, 40],
	iconAnchor: [14, 40],
	popupAnchor: [0, -34],
});

export const defaultQuebecLocations: QuebecLocation[] = [
	{
		id: "oasis-immersion",
		name: "OASIS immersion",
		description: "Expérience immersive permanente au Palais des congrès de Montréal, avec parcours déambulatoire et univers multimédia.",
		duration: "À définir",
		position: [45.5046, -73.5565],
	},
	{
		id: "centre-des-sciences",
		name: "Musée des sciences",
		description: "Centre des sciences de Montréal, au Vieux-Port, avec des expositions interactives pour apprendre en s’amusant.",
		duration: "À définir",
		position: [45.5079, -73.5543],
	},
	{
		id: "biosphere",
		name: "Biosphère",
		description: "Musée de l’environnement installé dans le dôme de l’Expo 67, sur l’Île Sainte-Hélène.",
		duration: "À définir",
		position: [45.5144, -73.5369],
	},
	{
		id: "mmfa",
		name: "Musée des beaux-arts de Montréal",
		description: "Grand musée montréalais consacré aux œuvres du Québec, du Canada et d’ailleurs.",
		duration: "À définir",
		position: [45.4983, -73.5792],
	},
	{
		id: "planetarium",
		name: "Planétarium",
		description: "Planétarium immersif d’Espace pour la vie où l’astronomie prend vie à travers spectacles et expositions.",
		duration: "À définir",
		position: [45.5608, -73.5437],
	},
	{
		id: "oratoire",
		name: "Oratoire Saint-Joseph",
		description: "Grand sanctuaire emblématique du Mont-Royal, reconnu pour sa basilique, ses visites et son atmosphère paisible.",
		duration: "À définir",
		position: [45.4924, -73.6186],
	},
	{
		id: "centre-ville",
		name: "Centre-ville",
		description: "Le cœur animé de Montréal, idéal pour les restos, les boutiques, les sorties et les soirées.",
		duration: "À définir",
		position: [45.5017, -73.5673],
	},
	{
		id: "vieux-port",
		name: "Vieux-Port",
		description: "Site riverain historique de Montréal avec terrasses, activités nautiques et ambiance de promenade.",
		duration: "À définir",
		position: [45.5074, -73.5534],
	},
	{
		id: "plateau",
		name: "Plateau",
		description: "Quartier vivant connu pour ses rues bordées d’arbres, ses cafés, ses restos et sa scène créative.",
		duration: "À définir",
		position: [45.5234, -73.5896],
	},
	{
		id: "jardin-botanique",
		name: "Jardin Botanique de Montréal",
		description: "Véritable musée vivant à deux pas du centre-ville, avec des plantes du monde entier.",
		duration: "À définir",
		position: [45.5611, -73.5637],
	},
	{
		id: "mont-tremblant",
		name: "Mont-Tremblant",
		description: "Destination laurentienne très populaire, entre village, centre de villégiature et activités quatre saisons.",
		duration: "2 jours",
		position: [46.1184, -74.5969],
	},
	{
		id: "ottawa",
		name: "Ottawa",
		description: "Capitale du Canada avec ses musées, le canal Rideau et ses quartiers faciles à explorer.",
		duration: "2 jours",
		position: [45.4215, -75.6972],
	},
	{
		id: "quebec-city",
		name: "Québec",
		description: "Ville historique au charme européen, parfaite pour une escapade plus longue et une belle parenthèse.",
		duration: "3 jours",
		position: [46.8139, -71.208],
	},
	{
		id: "mont-royal",
		name: "Mont-Royal",
		description: "Le grand parc emblématique de Montréal, idéal pour les vues, les marches et les petites pauses.",
		duration: "À définir",
		position: [45.5076, -73.5888],
	},
	{
		id: "village-quebecois-antan",
		name: "Village québécois d’Antan",
		description: "Village historique de Drummondville qui reconstitue le Québec d’autrefois à travers ses bâtiments et activités.",
		duration: "À définir",
		position: [45.8927, -72.4824],
	},
	{
		id: "montmorency",
		name: "Chutes Montmorency",
		description: "Parc spectaculaire près de Québec, célèbre pour sa chute de 83 mètres et ses points de vue.",
		duration: "À définir",
		position: [46.8918, -71.1507],
	},
	{
		id: "parc-omega",
		name: "Parc OMEGA",
		description: "Parc animalier immersif à Montebello où l’on observe la faune québécoise dans un cadre naturel.",
		duration: "À définir",
		position: [45.6378, -74.9439],
	},
	{
		id: "coaticook",
		name: "Coaticook",
		description: "Destination nature des Cantons-de-l’Est, connue pour sa gorge, ses sentiers et Foresta Lumina.",
		duration: "À définir",
		position: [45.1332, -71.7997],
	},
];

type QuebecMapProps = {
	title?: string;
	subtitle?: string;
	locations?: QuebecLocation[];
};

export default function QuebecMap({ title = "Poussin au Canada", subtitle = "", locations = defaultQuebecLocations }: QuebecMapProps) {
	return (
		<section className="quebecMap">
			<div className="quebecMap__header">
				<div>
					<h2 className="quebecMap__title">{title}</h2>
					<p className="quebecMap__subtitle">{subtitle}</p>
				</div>

				<div className="quebecMap__legend">
					<span className="quebecMap__legendDot" />
					<span>Clique sur un pin pour ouvrir sa fiche.</span>
				</div>
			</div>

			<div className="quebecMap__mapWrap">
				<MapContainer center={MONTREAL_CENTER} zoom={10} scrollWheelZoom={false} className="quebecMap__map" zoomControl={false}>
					<ZoomControl position="topright" />
					<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

					{locations.map((location) => (
						<Marker key={location.id} position={location.position} icon={pinkPin}>
							<Popup className="quebecPopup" closeButton={false} autoPanPadding={[24, 24]}>
								<div className="quebecPopup__card">
									<h3>{location.name}</h3>
									<p className="quebecPopup__desc">{location.description}</p>
									<div className="quebecPopup__meta">
										<span className="quebecPopup__label">Durée</span>
										<span className="quebecPopup__value">{location.duration}</span>
									</div>
								</div>
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>
		</section>
	);
}
