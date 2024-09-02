import factory
from factory import fuzzy
from django.utils import timezone
import random
from datetime import timedelta
from .models import Property

class PropertyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Property

    title = factory.Sequence(lambda n: f"Property {n+1}")
    description = fuzzy.FuzzyText(length=150)
    details = fuzzy.FuzzyText(length=200)
    projected_annual_return = fuzzy.FuzzyChoice([x * 0.01 for x in range(100, 1500)])
    price = fuzzy.FuzzyInteger(100000, 5000000, step=10)
    location = fuzzy.FuzzyChoice([
        'Tokyo', 'London', 'Paris', 'Berlin', 'Washington D.C.', 
        'Canberra', 'Ottawa', 'Beijing', 'Moscow', 'Brasília'
    ])
    country = fuzzy.FuzzyChoice([
        'Japan', 'UK', 'France', 'Germany', 'USA',
        'Australia', 'Canada', 'China', 'Russia', 'Brazil'
    ])
    property_type = fuzzy.FuzzyChoice(['Apartment', 'House', 'Commercial', 'Condo'])
    size = fuzzy.FuzzyDecimal(50.0, 1500.0, precision=2)
    year_built = fuzzy.FuzzyInteger(1900, timezone.now().year)
    image = factory.LazyFunction(
        lambda: [
            "https://example.com/insert.jpg",
            "https://media.istockphoto.com/id/1990444472/photo/scandinavian-style-cozy-living-room-interior.jpg?s=612x612&w=0&k=20&c=qgzrs_4vKDrOVo6gVc0EVb9-PziE-REbV9DcM5ZAfig=",
            "https://media.istockphoto.com/id/1456467039/photo/beautiful-living-room-and-kitchen-in-new-luxury-home-with-white-cabinets-wood-beams-pendant.jpg?s=612x612&w=0&k=20&c=x_ZXg6o_H6Bsww7Vr8126nXnNJULmYKABuXS3sc8qqE=",
            "https://media.istockphoto.com/id/1470719978/photo/luxurious-bedroom-interior.jpg?s=612x612&w=0&k=20&c=E_bv-cW97qeOjdsbOcPiVHC7e895OSkaaQrQoxuTMv0=",
            "https://media.istockphoto.com/id/621572026/photo/modern-bathroom-interior-with-minimalistic-shower.jpg?s=612x612&w=0&k=20&c=ifcuVWjqXeKOB7St7HZUiZxp-48RIp7ahkHIvxKj_8s="
        ]
    )
    video_urls = factory.LazyFunction(
        lambda: ["https://www.youtube.com/watch?v=0HWckWpe2FA&pp=ygUPMzYwIHN0cmVldCB2aWV3"]
    )
    amenities = factory.LazyFunction(
        lambda: {'amenities': random.sample([
            'Pool', 'Gym', 'Pet-friendly', 'WiFi', 'Elevator', 'Garage', 'Security',
            'Fireplace', 'Garden', 'Roof Deck'
        ], random.randint(0, 10))}
    )
    bedrooms = fuzzy.FuzzyInteger(1, 10)
    bathrooms = fuzzy.FuzzyDecimal(1.0, 5.0, precision=1)
    tokensSold = fuzzy.FuzzyInteger(0, 10000)
    
    total_investment_value = fuzzy.FuzzyInteger(100000, 7000000, step=10)
    underlying_asset_price = fuzzy.FuzzyInteger(100000, 5000000, step=10)
    closing_costs = fuzzy.FuzzyInteger(1000, 50000, step=10)
    upfront_fees = fuzzy.FuzzyInteger(500, 3000, step=10)
    operating_reserve = fuzzy.FuzzyInteger(1000, 20000, step=10)
    projected_annual_yield = fuzzy.FuzzyChoice([x * 0.01 for x in range(100, 1200)])
    projected_rental_yield = fuzzy.FuzzyChoice([x * 0.01 for x in range(100, 1200)])

    annual_gross_rents = fuzzy.FuzzyInteger(10000, 300000, step=10)
    property_taxes = fuzzy.FuzzyInteger(500, 10000, step=10)
    homeowners_insurance = fuzzy.FuzzyInteger(100, 10000, step=10)
    property_management = fuzzy.FuzzyInteger(500, 15000, step=10)
    dao_administration_fees = fuzzy.FuzzyInteger(100, 5000, step=10)
    annual_cash_flow = fuzzy.FuzzyInteger(-10000, 100000, step=10)
    monthly_cash_flow = fuzzy.FuzzyInteger(-1000, 10000, step=10)
    projected_annual_cash_flow = fuzzy.FuzzyInteger(500, 20000, step=10)

    total_tokens = fuzzy.FuzzyInteger(100000, 500000, step=10)
    token_price = fuzzy.FuzzyInteger(10, 500, step=10)
    blockchain_address = factory.LazyAttribute(lambda x: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe")
    legal_documents_url = factory.LazyAttribute(lambda _: "https://example.com/")

    # Add random timestamps
    created_at = factory.LazyFunction(lambda: timezone.now() - timedelta(days=random.randint(1, 365)))
    updated_at = factory.LazyAttribute(lambda o: o.created_at + timedelta(days=random.randint(0, (timezone.now() - o.created_at).days)))
